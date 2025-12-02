export class TreeBuilder {
  static build(paths: string[]): string {
    if (paths.length === 0) {
      return '';
    }

    const tree: Record<string, any> = {};

    for (const filePath of paths) {
      const normalizedPath = filePath.replace(/\\/g, '/');
      const parts = normalizedPath.split('/');
      let current = tree;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;

        if (!current[part]) {
          current[part] = isFile ? null : {};
        }

        if (!isFile && current[part] !== null) {
          current = current[part];
        }
      }
    }

    return this.renderTree(tree, '', true);
  }

  private static renderTree(
    node: Record<string, any>,
    prefix: string,
    isRoot: boolean
  ): string {
    let result = '';
    const entries = Object.entries(node).sort(
      ([a, childrenA], [b, childrenB]) => {
        const aIsFolder = childrenA !== null;
        const bIsFolder = childrenB !== null;

        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;

        return a.localeCompare(b);
      }
    );

    entries.forEach(([name, children], index) => {
      const isLast = index === entries.length - 1;
      const connector = isRoot ? '' : isLast ? '└── ' : '├── ';
      const extension = isRoot ? '' : isLast ? '    ' : '│   ';

      result += `${prefix}${connector}${name}\n`;

      if (children !== null) {
        result += this.renderTree(children, prefix + extension, false);
      }
    });

    return result;
  }
}

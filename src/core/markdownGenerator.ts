import * as path from 'path';
import { CollectedFile } from './fileCollector';
import { TreeBuilder } from '../utils/treeBuilder';

export class MarkdownGenerator {
  constructor(private workspacePath: string) {}

  async generate(files: CollectedFile[]): Promise<string> {
    const projectName = path.basename(this.workspacePath);
    const timestamp = new Date().toISOString();
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    let markdown = `# Project Context: ${projectName}\n\n`;
    markdown += `**Generated:** ${timestamp}  \n`;
    markdown += `**Total Files:** ${files.length}  \n`;
    markdown += `**Total Size:** ${this.formatBytes(totalSize)}\n\n`;

    markdown += `## Project Structure\n\n`;
    markdown += '```\n';
    markdown += TreeBuilder.build(files.map((f) => f.relativePath));
    markdown += '```\n\n';

    markdown += `## Files\n\n`;

    for (const file of files) {
      markdown += `### ${file.relativePath}\n\n`;
      markdown += `**Language:** ${file.language}  \n`;
      markdown += `**Size:** ${this.formatBytes(file.size)}  \n`;
      markdown += `**Last Modified:** ${file.lastModified.toISOString()}\n\n`;
      markdown += `\`\`\`${file.language}\n`;
      markdown += file.content;
      if (!file.content.endsWith('\n')) {
        markdown += '\n';
      }
      markdown += '```\n';
      markdown += '---\n\n';
    }

    return markdown;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

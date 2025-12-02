import { minimatch } from 'minimatch';
import { AIContextConfig } from '../core/configParser';

export class GlobMatcher {
  constructor(private config: AIContextConfig) {}

  shouldInclude(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');

    for (const excludePattern of this.config.excludes) {
      if (minimatch(normalizedPath, excludePattern, { dot: true })) {
        return false;
      }
    }

    if (this.config.includes.length === 0) {
      return true;
    }

    for (const includePattern of this.config.includes) {
      if (minimatch(normalizedPath, includePattern, { dot: true })) {
        return true;
      }
    }

    return false;
  }
}

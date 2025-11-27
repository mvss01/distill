import * as vscode from 'vscode';
import * as path from 'path';

export interface AIContextConfig {
  includes: string[];
  excludes: string[];
  respectGitignore: boolean;
}

export class ConfigParser {
  constructor(private workspacePath: string) {}

  async parse(): Promise<AIContextConfig> {
    const configPath = path.join(this.workspacePath, '.aicontext');
    const respectGitignore = vscode.workspace
      .getConfiguration('aicontext')
      .get<boolean>('respectGitignore', true);

    try {
      const configUri = vscode.Uri.file(configPath);
      const content = await vscode.workspace.fs.readFile(configUri);
      const lines = Buffer.from(content).toString('utf8').split('\n');

      const includes: string[] = [];
      const excludes: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) {
          continue;
        }

        if (trimmed.startsWith('!')) {
          excludes.push(trimmed.substring(1));
        } else {
          includes.push(trimmed);
        }
      }

      return { includes, excludes, respectGitignore };
    } catch {
      return {
        includes: ['**/*'],
        excludes: [],
        respectGitignore,
      };
    }
  }
}

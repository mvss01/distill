import * as vscode from 'vscode';
import * as path from 'path';
import { AIContextConfig } from './configParser';
import { GlobMatcher } from '../utils/globMatcher';

export interface CollectedFile {
  relativePath: string;
  absolutePath: string;
  content: string;
  size: number;
  language: string;
  lastModified: Date;
}

export class FileCollector {
  private matcher: GlobMatcher;
  private maxFileSize: number;

  constructor(private workspacePath: string, private config: AIContextConfig) {
    this.matcher = new GlobMatcher(config);
    this.maxFileSize = vscode.workspace
      .getConfiguration('aicontext')
      .get<number>('maxFileSize', 1048576);
  }

  async collect(): Promise<CollectedFile[]> {
    const files: CollectedFile[] = [];
    const allFiles = await this.findAllFiles();

    for (const file of allFiles) {
      const relativePath = path.relative(this.workspacePath, file.fsPath);

      const fileName = path.basename(relativePath);
      if (fileName.startsWith('.') || fileName === 'package-lock.json') {
        continue;
      }

      if (!this.matcher.shouldInclude(relativePath)) {
        continue;
      }

      try {
        const stat = await vscode.workspace.fs.stat(file);

        if (stat.size > this.maxFileSize) {
          continue;
        }

        const content = await vscode.workspace.fs.readFile(file);
        const textContent = Buffer.from(content).toString('utf8');

        if (this.isBinaryContent(textContent)) {
          continue;
        }

        files.push({
          relativePath,
          absolutePath: file.fsPath,
          content: textContent,
          size: stat.size,
          language: this.detectLanguage(relativePath),
          lastModified: new Date(stat.mtime),
        });
      } catch (error) {
        console.warn(`Erro ao processar ${relativePath}:`, error);
      }
    }

    return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }

  private async findAllFiles(): Promise<vscode.Uri[]> {
    const pattern = '**/*';
    const exclude = '**/node_modules/**';

    return await vscode.workspace.findFiles(pattern, exclude);
  }

  private isBinaryContent(content: string): boolean {
    const sample = content.substring(0, 8000);
    const nullBytes = (sample.match(/\0/g) || []).length;
    return nullBytes > 0;
  }

  private detectLanguage(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.c': 'c',
      '.cpp': 'cpp',
      '.h': 'c',
      '.hpp': 'cpp',
      '.cs': 'csharp',
      '.rb': 'ruby',
      '.php': 'php',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.md': 'markdown',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.xml': 'xml',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.sql': 'sql',
      '.sh': 'bash',
    };

    return languageMap[ext] || 'text';
  }
}

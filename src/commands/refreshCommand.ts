import * as vscode from 'vscode';
import * as path from 'path';
import { exportCommand } from './exportCommand';

export async function refreshCommand(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Nenhum workspace aberto');
    return;
  }

  const outputFileName = vscode.workspace
    .getConfiguration('aicontext')
    .get<string>('outputFileName', 'ai-context.md');

  const outputPath = path.join(workspaceFolder.uri.fsPath, outputFileName);

  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(outputPath));
    await exportCommand();
  } catch {
    vscode.window.showWarningMessage(
      'Arquivo de contexto não encontrado. Use "Export to Markdown" primeiro.'
    );
  }
}

import * as vscode from 'vscode';
import * as path from 'path';
import { FileCollector } from '../core/fileCollector';
import { MarkdownGenerator } from '../core/markdownGenerator';
import { ConfigParser } from '../core/configParser';

export async function exportCommand(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Nenhum workspace aberto');
    return;
  }

  let outputUri: vscode.Uri | null = null;
  let fileCount = 0;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Exportando contexto para Markdown',
      cancellable: false,
    },
    async (progress) => {
      try {
        progress.report({ increment: 0, message: 'Lendo configuração...' });

        const configParser = new ConfigParser(workspaceFolder.uri.fsPath);
        const config = await configParser.parse();

        progress.report({ increment: 20, message: 'Coletando arquivos...' });

        const collector = new FileCollector(workspaceFolder.uri.fsPath, config);
        const files = await collector.collect();

        if (files.length === 0) {
          vscode.window.showWarningMessage(
            'Nenhum arquivo encontrado para exportar'
          );
          return;
        }

        fileCount = files.length;

        progress.report({
          increment: 50,
          message: `Gerando Markdown (${files.length} arquivos)...`,
        });

        const generator = new MarkdownGenerator(workspaceFolder.uri.fsPath);
        const markdown = await generator.generate(files);

        progress.report({ increment: 80, message: 'Salvando arquivo...' });

        const outputFileName = vscode.workspace
          .getConfiguration('aicontext')
          .get<string>('outputFileName', 'ai-context.md');

        const outputPath = path.join(
          workspaceFolder.uri.fsPath,
          outputFileName
        );
        outputUri = vscode.Uri.file(outputPath);

        await vscode.workspace.fs.writeFile(
          outputUri,
          Buffer.from(markdown, 'utf8')
        );

        progress.report({ increment: 100, message: 'Concluído!' });
      } catch (error) {
        vscode.window.showErrorMessage(
          `Erro ao exportar: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  );

  if (outputUri && fileCount > 0) {
    const action = await vscode.window.showInformationMessage(
      `✅ Contexto exportado com sucesso (${fileCount} arquivos)`,
      'Abrir Arquivo'
    );

    if (action === 'Abrir Arquivo') {
      const doc = await vscode.workspace.openTextDocument(outputUri);
      await vscode.window.showTextDocument(doc);
    }
  }
}

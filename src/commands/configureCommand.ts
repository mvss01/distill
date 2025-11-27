import * as vscode from 'vscode';
import * as path from 'path';

const DEFAULT_CONFIG = `# Code2Context Configuration
# Sintaxe similar ao .gitignore

# Incluir arquivos TypeScript/JavaScript
src/**/*.ts
src/**/*.tsx
src/**/*.js
src/**/*.jsx

# Excluir node_modules e build
!node_modules/**
!dist/**
!out/**
!build/**

# Excluir testes (remova se quiser incluir)
!**/*.test.ts
!**/*.spec.ts

# Incluir arquivos de configuração importantes
package.json
tsconfig.json
README.md
`;

export async function configureCommand(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Nenhum workspace aberto');
    return;
  }

  const configPath = path.join(workspaceFolder.uri.fsPath, '.aicontext');
  const configUri = vscode.Uri.file(configPath);

  try {
    await vscode.workspace.fs.stat(configUri);
  } catch {
    await vscode.workspace.fs.writeFile(
      configUri,
      Buffer.from(DEFAULT_CONFIG, 'utf8')
    );
  }

  const doc = await vscode.workspace.openTextDocument(configUri);
  await vscode.window.showTextDocument(doc);
}

import * as vscode from 'vscode';
import * as path from 'path';

const DEFAULT_CONFIG = `# Distill - Arquivo de Configuração com sintaxe GLOB
# Linhas sem "!" = INCLUIR
# Linhas com "!" = EXCLUIR

# ===== INCLUIR =====
# Incluir todos os arquivos (exceto exclusões fixas: node_modules, arquivos ., package-lock.json)

# Ou especifique tipos específicos:
# src/**/*.ts
# src/**/*.tsx
# src/**/*.js
# src/**/*.jsx
# package.json
# tsconfig.json
# README.md

# ===== EXCLUIR =====
# Adicione aqui pastas/arquivos que você quer excluir
# Exemplos:

# Excluir builds
# !dist/**
# !build/**
# !out/**

# Excluir testes
# !**/*.test.ts
# !**/*.spec.ts

# Excluir pasta específica
# !temp/**
# !src/test/**

# Excluir arquivo específico
# !src/config/secrets.ts
# !README.old.md

# NOTA: A extensão já exclui automaticamente:
# - node_modules (sempre)
# - Arquivos que começam com "." (sempre)
# - package-lock.json (sempre)
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

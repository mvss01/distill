import * as vscode from 'vscode';
import { exportCommand } from './commands/exportCommand';
import { refreshCommand } from './commands/refreshCommand';
import { configureCommand } from './commands/configureCommand';

export function activate(context: vscode.ExtensionContext): void {
  console.log('Distill is now active');

  const exportDisposable = vscode.commands.registerCommand(
    'aicontext.export',
    () => exportCommand()
  );

  const refreshDisposable = vscode.commands.registerCommand(
    'aicontext.refresh',
    () => refreshCommand()
  );

  const configureDisposable = vscode.commands.registerCommand(
    'aicontext.configure',
    () => configureCommand()
  );

  context.subscriptions.push(
    exportDisposable,
    refreshDisposable,
    configureDisposable
  );
}

export function deactivate(): void {
  console.log('Distill is now deactivated');
}

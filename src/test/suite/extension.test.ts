import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('marcozito.distill'));
  });

  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension('marcozito.distill');
    assert.ok(ext);
    await ext!.activate();
    assert.strictEqual(ext!.isActive, true);
  });

  test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);

    assert.ok(
      commands.includes('aicontext.export'),
      'Command aicontext.export not found'
    );
    assert.ok(
      commands.includes('aicontext.refresh'),
      'Command aicontext.refresh not found'
    );
    assert.ok(
      commands.includes('aicontext.configure'),
      'Command aicontext.configure not found'
    );
  });

  test('Configure command should create .aicontext file', async function () {
    this.timeout(10000);

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      this.skip();
    }

    await vscode.commands.executeCommand('aicontext.configure');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const configPath = path.join(workspaceFolders[0].uri.fsPath, '.aicontext');
    const configUri = vscode.Uri.file(configPath);

    try {
      const stat = await vscode.workspace.fs.stat(configUri);
      assert.ok(stat.size > 0, '.aicontext file should not be empty');
    } catch (error) {
      assert.fail('.aicontext file should be created');
    }
  });

  test('Export command should require workspace', async () => {
    if (vscode.workspace.workspaceFolders) {
      return;
    }

    try {
      await vscode.commands.executeCommand('aicontext.export');
    } catch (error) {
      assert.ok(error);
    }
  });

  test('Configuration should have correct defaults', () => {
    const config = vscode.workspace.getConfiguration('aicontext');

    assert.strictEqual(
      config.get('outputFileName'),
      'ai-context.md',
      'Default output filename should be ai-context.md'
    );

    assert.strictEqual(
      config.get('respectGitignore'),
      true,
      'Should respect .gitignore by default'
    );

    assert.strictEqual(
      config.get('maxFileSize'),
      1048576,
      'Default max file size should be 1MB'
    );
  });
});

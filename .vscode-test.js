const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({
  files: 'out/test/**/*.test.js',
  version: 'stable',
  mocha: {
    ui: 'tdd',
    timeout: 20000,
    color: true,
  },
});

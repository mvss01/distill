import * as assert from 'assert';
import { GlobMatcher } from '../../utils/globMatcher';
import { AIContextConfig } from '../../core/configParser';

suite('FileCollector Test Suite', () => {
  test('GlobMatcher should include matching files', () => {
    const config: AIContextConfig = {
      includes: ['src/**/*.ts'],
      excludes: ['**/*.test.ts'],
      respectGitignore: true,
    };

    const matcher = new GlobMatcher(config);

    assert.strictEqual(matcher.shouldInclude('src/app.ts'), true);
    assert.strictEqual(matcher.shouldInclude('src/utils/helper.ts'), true);
    assert.strictEqual(matcher.shouldInclude('src/app.test.ts'), false);
    assert.strictEqual(matcher.shouldInclude('lib/app.ts'), false);
  });

  test('GlobMatcher should respect exclude patterns', () => {
    const config: AIContextConfig = {
      includes: ['**/*.ts'],
      excludes: ['node_modules/**', 'dist/**'],
      respectGitignore: true,
    };

    const matcher = new GlobMatcher(config);

    assert.strictEqual(matcher.shouldInclude('src/app.ts'), true);
    assert.strictEqual(
      matcher.shouldInclude('node_modules/lib/index.ts'),
      false
    );
    assert.strictEqual(matcher.shouldInclude('dist/bundle.ts'), false);
  });
});

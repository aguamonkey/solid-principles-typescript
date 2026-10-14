module.exports = {
  root: true, env: { browser: true, es2020: true, node: true },
  parser: '@typescript-eslint/parser', plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['dist', 'node_modules', 'playwright-report', 'test-results'],
  rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  overrides: [{ files: ['src/principles/**/bad-example/*'], rules: { '@typescript-eslint/no-explicit-any': 'off', 'react-hooks/exhaustive-deps': 'off' } }],
};

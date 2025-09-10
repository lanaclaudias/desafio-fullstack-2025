module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: { project: ['tsconfig.json'], sourceType: 'module' },
      plugins: ['@angular-eslint', '@typescript-eslint'],
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        'quotes': ['error', 'single'],
        'semi': ['error', 'always']
      }
    },
    {
      files: ['*.html'],
      plugins: ['@angular-eslint/template'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {}
    }
  ]
};
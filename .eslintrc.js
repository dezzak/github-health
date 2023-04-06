module.exports = {
  // Prevent ESLint from using rules in parent folders to this project.
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    // Airbnb's React ruleset, adapted for TypeScript
    'airbnb-typescript',
    // Prettier rules and plugins. Must be included after other extends, to avoid conflict.
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['/*.js', 'stubs/*', 'dist/*', 'node_modules/*'],
  rules: {
    'no-process-env': 'off',

    'no-console': 'off',

    // TypeScript is providing compile time prop checking
    'react/prop-types': 'off',

    'react/require-default-props': 'off',

    // Enforce import ordering and spacing
    'import/order': ['error', { 'newlines-between': 'always' }],

    // disallows irregular whitespace that can't easily be seen
    'no-irregular-whitespace': [
      'error',
      {
        skipStrings: false,
        skipTemplates: false,
        skipRegExps: false,
        skipComments: false,
      },
    ],
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
    },
  ],
  settings: {
    react: {
      version: '16.0',
    },
  },
}

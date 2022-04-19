module.exports = {
    // Prevent ESLint from using rules in parent folders to this project.
    root: true,
    extends: [
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
    ignorePatterns: ['/*.js', 'stubs/*'],
    rules: {
        // Only allow process.env in specific, centralised locations.
        // The collects together all environment variable usage.
        'no-process-env': 'error',

        // Console should not be used directly, to ensure our logging is done in a
        // safe and reportable way for the cluster
        'no-console': 'error',

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
    settings: {
        react: {
            version: 'detect',
        },
    },
}

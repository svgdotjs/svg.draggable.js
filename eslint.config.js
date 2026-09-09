import js from '@eslint/js'
import prettier from 'eslint-config-prettier'

export default [
  // formatting for these is handled by prettier, eslint cannot parse them
  { ignores: ['node_modules/**', 'dist/**', '**/*.ts'] },
  js.configs.recommended,
  // has to stay last so it can turn off the rules prettier owns
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        window: 'readonly',
      },
    },
  },
]

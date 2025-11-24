import antfu from '@antfu/eslint-config'
import turboPlugin from 'eslint-plugin-turbo'

/** @type {import("eslint").Linter.Config[]} */
export default antfu(
  {
    react: true,
    typescript: true,
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
    ignores: [
      'dist/**',
      '.claude/**',
      'node_modules/**',
      'guides/**',
      'src/api/CHAT_API.md',
    ],
    isInEditor: false,
  },
  {
    plugins: { turbo: turboPlugin },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',

      // React scope no longer necessary with new JSX transform
      'react/react-in-jsx-scope': 'off',

      // Downgrade some strict rules to warnings
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'warn',

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',

      // Unused variables (including destructured)
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // Prefer const over let
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: false,
        },
      ],

      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          internalPattern: ['^@/.*'],
          newlinesBetween: 'always',
        },
      ],

      // Object/destructuring formatting (3+ properties)
      'style/object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            multiline: true,
            minProperties: 3,
          },
          ObjectPattern: {
            multiline: true,
            minProperties: 3,
          },
          ImportDeclaration: {
            multiline: true,
            minProperties: 3,
          },
          ExportDeclaration: {
            multiline: true,
            minProperties: 3,
          },
        },
      ],

      // React JSX props formatting (2+ props)
      'style/jsx-max-props-per-line': [
        'error',
        { maximum: 1 },
      ],
      'style/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'style/jsx-closing-bracket-location': ['error', 'tag-aligned'],
    },
  },
)

import antfu from '@antfu/eslint-config'

export default antfu(
  {
    isInEditor: false,
    unocss: { strict: true },
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
    ignores: ['public/mockServiceWorker.js'],
  },
  {
    files: ['**/*.ts', '**/*.js', '**/*.vue'],
    rules: {
      'no-console': 1,
      'antfu/if-newline': 0,
    },
  },
).override(
  'antfu/perfectionist/setup',
  {
    rules: {
      // https://github.com/antfu/eslint-config/blob/main/src/configs/perfectionist.ts
      'perfectionist/sort-imports': ['error', {
        groups: [
          'type',
          ['parent-type', 'sibling-type', 'index-type'],

          'builtin',
          'external',
          ['internal', 'internal-type'],
          ['parent', 'sibling', 'index'],
          'side-effect',
          'object',
          'unknown',
        ],
        // newlinesBetween: 'ignore',
        order: 'asc',
        type: 'natural',
      }],
    },
  },
)

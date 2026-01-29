import eslint from '@eslint/js'
import type { Linter } from 'eslint'
import pluginImportX from 'eslint-plugin-import-x'
import pluginRegExp from 'eslint-plugin-regexp'
import tseslint from 'typescript-eslint'

const eslintRecommended = eslint.configs.recommended
const regExpRecommended = pluginRegExp.configs['flat/recommended']

const [
  // typescript-eslint/base
  tsESLintPlugin,

  // typescript-eslint/eslint-recommended
  tsESLintESLintRecommended,

  // typescript-eslint/recommended
  tsESLintRecommended,
] = tseslint.configs.recommended

const [
  ,
  ,
  // typescript-eslint/stylistic
  tsESLintStylistic,
] = tseslint.configs.stylistic

const useBase: () => Linter.Config[] = () => {
  return [
    {
      // name + languageOptions + plugins
      ...tsESLintPlugin,
      name: 'typescript-eslint/base',
    },
    {
      name: 'eslint-plugin-regexp/base',
      plugins: regExpRecommended.plugins,
    },
    {
      name: 'eslint-plugin-import-x/base',
      plugins: {
        'import-x': pluginImportX as any,
      },
    },
    {
      name: 'keenghost/base',
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2022,
          ecmaFeatures: { jsx: true },
        },
      },
    },
  ]
}

const useBaseRules: () => Linter.Config[] = () => {
  return [
    {
      name: 'eslint/recommended',
      rules: eslintRecommended.rules,
    },
    {
      name: 'typescript-eslint/eslint-recommended',
      rules: tsESLintESLintRecommended.rules,
    },
    {
      name: 'typescript-eslint/recommended',
      rules: tsESLintRecommended.rules,
    },
    {
      name: 'typescript-eslint/stylistic',
      rules: tsESLintStylistic.rules,
    },
    {
      name: 'eslint-plugin-regexp/recommended',
      rules: regExpRecommended.rules,
    },
    {
      name: 'keenghost/base/recommended',
      rules: {
        eqeqeq: ['error', 'always', { null: 'never' }],
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-new-wrappers': 'error',
        'no-useless-concat': 'warn',

        '@typescript-eslint/explicit-module-boundary-types': ['error', { allowArgumentsExplicitlyTypedAsAny: true }],
        '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
        '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],

        'import-x/no-duplicates': 'error',

        'regexp/prefer-regexp-exec': 'error',
        'regexp/prefer-regexp-test': 'error',

        // sort imports, including declarations order and members order
        'sort-imports': ['error', { ignoreDeclarationSort: true }],
        'import-x/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],

        // make type-only import correct
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            disallowTypeAnnotations: true,
            fixStyle: 'separate-type-imports',
          },
        ],
        'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],

        // based on experience
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ]
}

export { useBase, useBaseRules }

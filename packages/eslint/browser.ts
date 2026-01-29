import globals from 'globals'
import type { Linter } from 'eslint'

interface IUseBrowser {
  files: Linter.Config['files']
}

const useBrowser: (options: IUseBrowser) => Linter.Config[] = options => {
  if (!Array.isArray(options?.files) || options.files.length === 0) {
    throw new Error("useBrowser must have files input.\nIf lint all ts files, use ['**/*.ts'] as files input.")
  }

  return [
    {
      name: 'keenghost/browser/setup',
      languageOptions: {
        globals: {
          ...globals.browser,
        },
      },
      files: options.files,
    },
  ]
}

interface IUseBrowserRules {
  files: Linter.Config['files']
  rules?: Linter.Config['rules']
}

const useBrowserRules: (options: IUseBrowserRules) => Linter.Config[] = options => {
  if (!Array.isArray(options?.files) || options.files.length === 0) {
    throw new Error("useBrowserRules must have files input.\nIf lint all ts files, use ['**/*.ts'] as files input.")
  }

  const commonConfig = {
    files: options.files,
  }

  return [
    {
      ...commonConfig,
      name: 'keenghost/browser/recommended',
      rules: {
        'no-alert': 'error',
        'no-implied-eval': 'error',
      },
    },
    {
      ...commonConfig,
      name: 'keenghost/browser/user',
      rules: options.rules ?? {},
    },
  ]
}

export { useBrowser, useBrowserRules }

import globals from 'globals'
import type { Linter } from 'eslint'

interface IUseBrowserPreset {
  files: Linter.Config['files']
  rules?: Linter.Config['rules']
}

/**
 * - enable browser globals
 * - enable keenghost recommended rules
 */
const useBrowserPreset: (options: IUseBrowserPreset) => Linter.Config[] = options => {
  if (!Array.isArray(options?.files) || options.files.length === 0) {
    return []
  }

  const envConfigs: Linter.Config[] = [
    {
      name: 'keenghost/browser/setup',
      files: options.files,
      languageOptions: {
        globals: {
          ...globals.browser,
        },
      },
    },
  ]

  const rules: Linter.Config[] = [
    {
      name: 'keenghost/browser/recommended',
      files: options.files,
      rules: {
        'no-alert': 'error',
        'no-implied-eval': 'error',
      },
    },
    {
      name: 'keenghost/browser/user',
      files: options.files,
      rules: options.rules ?? {},
    },
  ]

  return [...envConfigs, ...rules]
}

export { useBrowserPreset }

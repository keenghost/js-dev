import globals from 'globals'
import pluginN from 'eslint-plugin-n'
import type { Linter } from 'eslint'

interface IUseNodePreset {
  files: Linter.Config['files']
  rules?: Linter.Config['rules']
}

/**
 * - enable node globals
 * - enable eslint-plugin-n
 * - enable keenghost recommended rules
 */
const useNodePreset: (options: IUseNodePreset) => Linter.Config[] = options => {
  if (!Array.isArray(options?.files) || options.files.length === 0) {
    return []
  }

  const envConfigs: Linter.Config[] = [
    {
      name: 'keenghost/node/setup',
      plugins: {
        n: pluginN,
      },
      languageOptions: {
        globals: {
          ...globals.node,
        },
      },
      files: options.files,
    },
  ]

  const rules: Linter.Config[] = [
    {
      name: 'keenghost/node/recommended',
      files: options.files,
      rules: {
        'n/prefer-node-protocol': 'error',
      },
    },
    {
      name: 'keenghost/node/user',
      files: options.files,
      rules: options.rules ?? {},
    },
  ]

  return [...envConfigs, ...rules]
}

export { useNodePreset }

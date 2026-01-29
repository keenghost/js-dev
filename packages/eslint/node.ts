import globals from 'globals'
import pluginN from 'eslint-plugin-n'
import type { Linter } from 'eslint'

interface IUseNode {
  files: Linter.Config['files']
}

const useNode: (options: IUseNode) => Linter.Config[] = options => {
  if (!Array.isArray(options?.files) || options.files.length === 0) {
    throw new Error("useNode must have files input.\nIf lint all ts files, use ['**/*.ts'] as files input.")
  }

  return [
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
}

interface IUseNodeRules {
  files: Linter.Config['files']
  rules?: Linter.Config['rules']
}

const useNodeRules: (options: IUseNodeRules) => Linter.Config[] = options => {
  if (!Array.isArray(options?.files) || options.files.length === 0) {
    throw new Error("useNodeRules must have files input.\nIf lint all ts files, use ['**/*.ts'] as files input.")
  }

  const commonConfig = {
    files: options.files,
  }

  return [
    {
      ...commonConfig,
      name: 'keenghost/node/recommended',
      rules: {
        'n/prefer-node-protocol': 'error',
      },
    },
    {
      ...commonConfig,
      name: 'keenghost/node/user',
      rules: options.rules ?? {},
    },
  ]
}

export { useNode, useNodeRules }

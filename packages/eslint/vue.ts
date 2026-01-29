import type { Linter } from 'eslint'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

interface IUseVue {
  files: Linter.Config['files']
}

const useVue: (options: IUseVue) => Linter.Config[] = options => {
  if (!Array.isArray(options?.files) || options.files.length === 0) {
    throw new Error("useVue must have files input.\nIf lint all vue files, use ['**/*.vue'] as files input.")
  }

  const officialConfigs = pluginVue.configs['flat/recommended']
  // const bootOfficialConfig = officialConfigs[0]
  const mainOfficialConfig = officialConfigs[1]
  const commonConfig = {
    files: options.files,
  }

  return [
    // {
    //   name: 'eslint-plugin-vue/base/setup',
    //   plugins: bootOfficialConfig.plugins,
    //   languageOptions: bootOfficialConfig.languageOptions,
    // },
    {
      ...commonConfig,
      name: 'eslint-plugin-vue/base/setup-for-vue',
      plugins: mainOfficialConfig.plugins,
      languageOptions: mainOfficialConfig.languageOptions,
      processor: mainOfficialConfig.processor,
      rules: mainOfficialConfig.rules,
    },
    {
      ...commonConfig,
      name: 'keenghost/vue/tseslint-extra-file-extension',
      languageOptions: {
        parserOptions: {
          parser: tseslint.parser,
          extraFileExtensions: ['.vue'],
        },
      },
    },
  ]
}

interface IUseVueRules {
  files: Linter.Config['files']
  rules?: Linter.Config['rules']
}

const useVueRules: (options: IUseVueRules) => Linter.Config[] = options => {
  if (!Array.isArray(options?.files) || options.files.length === 0) {
    throw new Error("useVueRules must have files input.\nIf lint all vue files, use ['**/*.vue'] as files input.")
  }

  const officialConfigs = pluginVue.configs['flat/recommended']
  const bootOfficialConfig = officialConfigs[0]
  const mainOfficialConfig = officialConfigs[1]
  const restOfficialConfigs = officialConfigs.filter(
    config => config !== bootOfficialConfig && config !== mainOfficialConfig,
  )

  const restOfficialRules: Record<string, Linter.RuleEntry> = {}
  for (const config of restOfficialConfigs) {
    if (config.rules) {
      Object.assign(restOfficialRules, config.rules)
    }
  }

  const commonConfig = {
    files: options.files,
  }

  return [
    {
      ...commonConfig,
      name: 'eslint-plugin-vue/flat/recommended',
      rules: restOfficialRules,
    },
    {
      ...commonConfig,
      name: 'keenghost/vue/recommended',
      rules: {
        // vue/essential/rules
        'vue/multi-word-component-names': 'off', // force Pascal Case

        // vue/strongly-recommended/rules
        'vue/max-attributes-per-line': 'off', // passthrough to prettier printWidth
        'vue/singleline-html-element-content-newline': 'off', // neatness layout
      },
    },
    {
      ...commonConfig,
      name: 'keenghost/vue/user',
      rules: options.rules ?? {},
    },
  ]
}

export { useVue, useVueRules }

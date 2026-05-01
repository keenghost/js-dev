import type { Linter } from 'eslint'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import { useBrowserPreset } from './browser.js'

interface IUseVuePreset {
  files: Linter.Config['files']
  rules?: Linter.Config['rules']
}

/**
 * - enable browser preset
 * - enable eslint-plugin-vue
 * - enable eslint-plugin-vue recommended rules
 * - enable keenghost recommended rules
 */
const useVuePreset: (options: IUseVuePreset) => Linter.Config[] = options => {
  if (!Array.isArray(options?.files) || options.files.length === 0) {
    return []
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

  const envConfigs: Linter.Config[] = [
    // {
    //   name: 'eslint-plugin-vue/base/setup',
    //   plugins: bootOfficialConfig.plugins,
    //   languageOptions: bootOfficialConfig.languageOptions,
    // },
    {
      name: 'eslint-plugin-vue/base/setup-for-vue',
      files: options.files,
      plugins: mainOfficialConfig.plugins,
      languageOptions: mainOfficialConfig.languageOptions,
      processor: mainOfficialConfig.processor,
      rules: mainOfficialConfig.rules,
    },
    {
      name: 'keenghost/vue/tseslint-extra-file-extension',
      files: options.files,
      languageOptions: {
        parserOptions: {
          parser: tseslint.parser,
          extraFileExtensions: ['.vue'],
        },
      },
    },
  ]

  const rules: Linter.Config[] = [
    {
      name: 'eslint-plugin-vue/flat/recommended',
      files: options.files,
      rules: restOfficialRules,
    },
    {
      name: 'keenghost/vue/recommended',
      files: options.files,
      rules: {
        // vue/essential/rules
        'vue/multi-word-component-names': 'off', // force Pascal Case

        // vue/strongly-recommended/rules
        'vue/max-attributes-per-line': 'off', // passthrough to prettier printWidth
        'vue/require-default-prop': 'off', // optional should be optional
        'vue/singleline-html-element-content-newline': 'off', // neatness layout

        'vue/html-indent': 'off', // conflit with prettier
        'vue/html-self-closing': [
          'warn',
          {
            html: { void: 'always', normal: 'always', component: 'always' },
            svg: 'always',
            math: 'always',
          },
        ], // void conflit with prettier
      },
    },
    {
      name: 'keenghost/vue/user',
      files: options.files,
      rules: options.rules ?? {},
    },
  ]

  return [...useBrowserPreset({ files: options.files }), ...envConfigs, ...rules]
}

export { useVuePreset }

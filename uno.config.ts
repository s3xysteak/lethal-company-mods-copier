import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'

import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  shortcuts: [['flex-center', 'items-center justify-center']],
  presets: [
    presetUno(),
    presetIcons(),
    presetDaisy(),
    presetAttributify({
      prefix: 'uno-'
    })
  ],
  transformers: [transformerDirectives()]
})

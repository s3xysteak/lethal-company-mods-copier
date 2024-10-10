import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

import { presetDaisy } from 'unocss-preset-daisy'

export default defineConfig({
  shortcuts: [
    ['flex-center', 'items-center justify-center'],
  ],
  presets: [
    presetUno(),
    presetIcons(),
    presetDaisy(),
    presetAttributify({
      prefix: 'uno-',
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})

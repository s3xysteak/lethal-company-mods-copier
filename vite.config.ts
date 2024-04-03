import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import UnoCSS from 'unocss/vite'

export default defineConfig(async () => ({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'vue-i18n'],
      dts: 'types/auto-imports.d.ts',
    }),
    Components({
      dts: 'types/components.d.ts',
    }),
  ],

  clearScreen: false,

  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
}))

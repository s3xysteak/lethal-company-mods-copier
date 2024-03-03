import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [vue(), vueJsx(), UnoCSS()],

  clearScreen: false,

  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**']
    }
  }
}))

import { createApp } from 'vue'
import App from './App.vue'

import i18n from './locales'

import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'

createApp(App)
  .use(i18n)
  .mount('#app')

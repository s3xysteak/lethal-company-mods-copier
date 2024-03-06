<script setup lang="ts">
import run from './views/run.vue'

import { locale } from '@tauri-apps/api/os'
import { i18nMessage } from './locales'

const { locale: userLanguage } = useI18n({ useScope: 'global' })

locale().then(fullLang => {
  if (!fullLang) {
    userLanguage.value = 'en'
    return
  }

  const langKeyList = Object.keys(i18nMessage)
  const lang = fullLang?.split('-')[0]

  userLanguage.value = langKeyList.includes(fullLang)
    ? fullLang
    : langKeyList.includes(lang)
    ? lang
    : 'en'
})
</script>

<template>
  <run />
</template>

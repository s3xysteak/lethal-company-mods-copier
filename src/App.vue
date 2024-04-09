<script setup lang="ts">
import { open } from '@tauri-apps/plugin-shell'
import { locale } from '@tauri-apps/plugin-os'
import run from './views/run.vue'

import { i18nMessage } from './locales'

const { locale: userLanguage } = useI18n({ useScope: 'global' })

locale().then((fullLang) => {
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

const GITHUB = 'https://github.com/s3xysteak/lethal-company-mods-copier'
</script>

<template>
  <div>
    <div absolute right-10 top-10 class="tooltip tooltip-bottom" data-tip="Open in Github">
      <a
        class="btn btn-circle btn-ghost"
        :href="GITHUB" alt="Open in Github"
        @click.prevent="open(GITHUB)"
      >
        <div i-carbon-logo-github text-6 />
      </a>
    </div>
    <run />
  </div>
</template>

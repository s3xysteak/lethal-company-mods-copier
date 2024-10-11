<script setup lang="ts">
import { locale } from '@tauri-apps/plugin-os'
import { open } from '@tauri-apps/plugin-shell'
import { i18nMessage } from './locales'

import run from './views/run.vue'

const { locale: userLanguage, availableLocales } = useI18n({ useScope: 'global' })

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

const langMap: Record<string, string> = {
  en: 'English',
  zh: '简体中文',
}
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

    <div absolute right-30 top-10 class="dropdown-hover dropdown">
      <label tabindex="0" class="m-1 btn btn-circle btn-ghost">
        <div i-carbon-language />
      </label>

      <ul class="dropdown-content p-2 shadow menu rounded-box">
        <li v-for="lang in availableLocales" :key="lang" @click="userLanguage = lang">
          <a :class="userLanguage === lang && 'active'" text-nowrap>{{ langMap[lang] }}</a>
        </li>
      </ul>
    </div>

    <Suspense>
      <run />
    </Suspense>
  </div>
</template>

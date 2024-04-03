import { createI18n } from 'vue-i18n'

const _modules = import.meta.glob('./*.json', {
  eager: true,
  import: 'default',
})

export const i18nMessage = Object.entries(_modules).reduce(
  (acc, [key, val]) => {
    const keyArr = key.split('/')
    acc[keyArr[keyArr.length - 1].replace('.json', '')] = val
    return acc
  },
  {} as Record<string, any>,
)

export default createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: i18nMessage,
})

<script setup lang="tsx">
import { getGamePath, copyFiles, getCurrentDirFilesNameList } from '../utils'
import { useModal } from '../components/useModal.tsx'

const { t } = useI18n()

const LETHAL_COMPANY_STEAM_CODE = '1966720'

const FILES_NAME_WHITE_LIST = [
  '_state',
  'BepInEx',
  'doorstop_config.ini',
  'mods.yml',
  'winhttp.dll'
]

const { modal, modalCtx } = useModal()

const loading = ref(false)

async function run() {
  loading.value = true

  try {
    const gamePath = await getGamePath(LETHAL_COMPANY_STEAM_CODE)

    const currentDirFilesNameList = await getCurrentDirFilesNameList()

    const fileNameList = currentDirFilesNameList.filter(item =>
      FILES_NAME_WHITE_LIST.includes(item)
    )

    for (const name of fileNameList) {
      await copyFiles(`.\\${name}`, `${gamePath}\\${name}`)
    }

    modal(
      <>
        <div class="flex items-center gap-x-2 font-bold text-lg">
          <div class="bg-green i-carbon-checkmark-outline" />
          {t('startCopy.success.title')}
        </div>
        <p class="py-4">{t('startCopy.success.content')}</p>
      </>
    )
  } catch (error) {
    console.error(error)

    modal(
      <>
        <h3 class="flex items-center gap-x-2 font-bold text-lg">
          <div class="bg-red-5 i-carbon-close-outline" />
          {t('startCopy.error')}
        </h3>
        <p class="py-4">{String(error)}</p>
      </>
    )
  }

  loading.value = false
}
</script>

<template>
  <div h-100vh w-100vw flex="~ center">
    <modalCtx />

    <button :disabled="loading" class="btn" @click="run">
      <span v-show="loading" class="loading" />
      <div v-show="loading">{{ t('startCopy.loading') }}</div>

      <div v-show="!loading">{{ t('startCopy.common') }}</div>
    </button>
  </div>
</template>

<script setup lang="tsx">
import { copyFiles, getFilesName } from '../utils/io.ts'
import { getGamePath } from '../utils/path.ts'
import { useModal } from '../components/useModal.tsx'

const { t } = useI18n()

const LETHAL_COMPANY_STEAM_CODE = '1966720'

const FILES_NAME_WHITE_LIST = [
  '_state',
  'BepInEx',
  'doorstop_config.ini',
  'mods.yml',
  'winhttp.dll',
]

const { modal, modalCtx } = useModal()

const loading = ref(false)

async function usePath() {
  const gamePath = await getGamePath(LETHAL_COMPANY_STEAM_CODE)

  const fileNameList = await getFilesName()

  return {
    gamePath,
    fileNameList: fileNameList.filter(item => FILES_NAME_WHITE_LIST.includes(item)),
  }
}

async function copy() {
  loading.value = true

  try {
    const {
      fileNameList,
      gamePath,
    } = await usePath()

    for (const name of fileNameList)
      await copyFiles(`.\\${name}`, `${gamePath}\\${name}`)

    modal(
      <>
        <div class="flex items-center gap-x-2 text-lg font-bold">
          <div class="i-carbon-checkmark-outline bg-green" />
          {t('startCopy.success.title')}
        </div>
        <p class="py-4">{t('startCopy.success.content')}</p>
      </>,
    )
  }
  catch (error) {
    console.error(error)

    modal(
      <>
        <h3 class="flex items-center gap-x-2 text-lg font-bold">
          <div class="i-carbon-close-outline bg-red-5" />
          {t('startCopy.error')}
        </h3>
        <p class="py-4">{String(error)}</p>
      </>,
    )
  }

  loading.value = false
}
</script>

<template>
  <div h-100vh w-100vw flex="~ center">
    <modalCtx />

    <Button :disabled="loading" :loading="loading" @click="copy">
      {{ t('startCopy.common') }}
    </Button>
  </div>
</template>../utils/path.ts

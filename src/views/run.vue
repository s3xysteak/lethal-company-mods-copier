<script setup lang="tsx">
import { remove } from '@tauri-apps/plugin-fs'
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

async function usePath() {
  const gamePath = await getGamePath(LETHAL_COMPANY_STEAM_CODE)

  const fileNameList = await getFilesName()

  return {
    gamePath,
    fileNameList: fileNameList.filter(item => FILES_NAME_WHITE_LIST.includes(item)),
  }
}

interface ModalComponentProps {
  title: string
  titleIconClass: string
  content: string
}
const ModalComponent = defineComponent((props: ModalComponentProps) => {
  return () => (
    <>
      <h3 class="flex items-center gap-x-2 text-lg font-bold">
        <div class={props.titleIconClass} />
        {props.title}
      </h3>
      <p class="py-4">{props.content}</p>
    </>
  )
}, {
  props: ['title', 'titleIconClass', 'content'],
})

const loading = ref(false)
async function useLoading(cb: () => Promise<void>) {
  loading.value = true
  await cb()
  loading.value = false
}

async function onCopy() {
  const copy = async () => {
    const {
      fileNameList,
      gamePath,
    } = await usePath()

    for (const name of fileNameList)
      await copyFiles(`.\\${name}`, `${gamePath}\\${name}`)

    modal(
      <ModalComponent
        titleIconClass="i-carbon-checkmark-outline bg-green"
        title={t('startCopy.success.title')}
        content={t('startCopy.success.content')}
      />,
    )
  }

  await copy().catch((error) => {
    console.error(error)

    modal(
      <ModalComponent
        titleIconClass="i-carbon-close-outline bg-red-5"
        title={t('startCopy.error')}
        content={String(error)}
      />,
    )
  })
}

async function onDelete() {
  const del = async () => {
    const {
      fileNameList,
      gamePath,
    } = await usePath()

    for (const name of fileNameList)
      await remove(`${gamePath}\\${name}`, { recursive: true })

    modal(
      <ModalComponent
        titleIconClass="i-carbon-checkmark-outline bg-green"
        title={t('startCopy.success.title')}
        content={t('startCopy.success.content')}
      />,
    )
  }

  await del().catch((error) => {
    console.error(error)

    modal(
      <ModalComponent
        titleIconClass="i-carbon-close-outline bg-red-5"
        title={t('startCopy.error')}
        content={String(error)}
      />,
    )
  })
}
</script>

<template>
  <div h-100vh w-100vw flex="~ center">
    <modalCtx />

    <div flex="~ col gap-y-4">
      <Button :disabled="loading" :loading="loading" @click="useLoading(onCopy)">
        <div flex="~ center gap-x-2">
          <div i-carbon-copy-file text-5 />
          {{ t('startCopy.common') }}
        </div>
      </Button>
      <Button :disabled="loading" :loading="loading" @click="useLoading(onDelete)">
        <div flex="~ center gap-x-2">
          <div i-carbon-reset text-5 />
          {{ t('startDelete.common') }}
        </div>
      </Button>
    </div>
  </div>
</template>../utils/path.ts

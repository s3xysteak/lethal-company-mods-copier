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
async function onCopy() {
  loading.value = true

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

  loading.value = false
}
</script>

<template>
  <div h-100vh w-100vw flex="~ center">
    <modalCtx />

    <Button :disabled="loading" :loading="loading" @click="onCopy">
      {{ t('startCopy.common') }}
    </Button>
  </div>
</template>../utils/path.ts

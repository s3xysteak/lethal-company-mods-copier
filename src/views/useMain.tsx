import { exists, remove } from '@tauri-apps/plugin-fs'
import { useRefHistory } from '@vueuse/core'
import { dirname, join } from 'pathe'
import { useModal } from '../components/useModal.tsx'
import { copyFiles, getFilesName, unzip } from '../utils/io.ts'
import { getGamePath } from '../utils/path.ts'

export function useMain() {
  const { modal, modalCtx } = useModal()
  const { t } = useI18n()
  const LETHAL_COMPANY_STEAM_CODE = '1966720'
  const FILES_NAME_WHITE_LIST = [
    '_state',
    'BepInEx',
    'doorstop_config.ini',
    'mods.yml',
    'winhttp.dll',
  ]
  const base = ref('./')
  const { undo, canUndo } = useRefHistory(base)

  interface ModalComponentProps {
    title: string
    titleIconClass: string
    content: string
  }
  const ModalComponent = defineComponent((props: ModalComponentProps) => {
    return () => (
      <div class="flex flex-col gap-y-4">
        <h3 class="flex items-center gap-x-2 text-lg font-bold">
          <div class={props.titleIconClass} />
          {props.title}
        </h3>
        <main>
          {
            props.content.split('\n').map(item => <p>{item}</p>)
          }
        </main>
      </div>
    )
  }, {
    props: ['title', 'titleIconClass', 'content'],
  })

  const loading = ref(false)
  const loadingText = ref(t('loading'))
  const resetLoadingText = () => loadingText.value = t('loading')

  async function doCopy() {
    const copy = async () => {
      const PATH = join(dirname(base.value), '--temp-lc-mods-copier')

      loadingText.value = t('loading-delete')
      await exists(PATH) && await remove(PATH, { recursive: true })

      loadingText.value = t('loading-unzip')
      await unzip(base.value, PATH)

      loadingText.value = t('loading-copy')
      const fileNameList = await getFilesName(PATH)
      const gamePath = await getGamePath(LETHAL_COMPANY_STEAM_CODE)
      let times = 0

      for (const name of fileNameList.filter(item => FILES_NAME_WHITE_LIST.includes(item))) {
        const { counts } = await copyFiles(join(PATH, name), join(gamePath, name))
        times += counts
      }

      loadingText.value = t('loading-clear-cache')
      await remove(PATH, { recursive: true })

      modal(
        <ModalComponent
          titleIconClass="i-carbon-checkmark-outline bg-green"
          title={t('startCopy.success.title')}
          content={`${times === 0
            ? t('startCopy.success.empty')
            : t('startCopy.success.counts', { counts: times })}\n${t('startCopy.success.content')}`}
        />,
      )
    }

    loading.value = true
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
    resetLoadingText()
  }

  async function doDelete() {
    const del = async () => {
      const gamePath = await getGamePath(LETHAL_COMPANY_STEAM_CODE)

      for (const name of FILES_NAME_WHITE_LIST) {
        const p = join(gamePath, name)
        await exists(p) && await remove(p, { recursive: true })
      }

      modal(
        <ModalComponent
          titleIconClass="i-carbon-checkmark-outline bg-green"
          title={t('startCopy.success.title')}
          content={t('startCopy.success.content')}
        />,
      )
    }

    loading.value = true
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
    loading.value = false
  }

  return {
    modalCtx,
    undo,
    canUndo,
    loading,
    loadingText,
    doCopy,
    doDelete,
    base,
  }
}

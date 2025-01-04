<script setup lang="tsx">
import { useMain } from './useMain'

const {
  modalCtx,
  undo,
  canUndo,
  loading,
  loadingText,
  doCopy,
  doDelete,
  base,
} = useMain()
</script>

<template>
  <div h-100vh w-100vw flex="~ center">
    <modalCtx />

    <div w-80 flex="~ col gap-y-4">
      <div h-12 flex rounded-2 shadow>
        <button class="btn" rounded-r-none :disabled="!canUndo" @click="undo">
          <div i-carbon-return />
        </button>

        <FolderSelect
          v-model="base"
          grow rounded-r-2
        />
      </div>

      <Button :disabled="loading" :loading :loading-text @click="doCopy">
        <div flex="~ center gap-x-2">
          <div i-carbon-copy-file text-5 />
          {{ $t('startCopy.common') }}
        </div>
      </Button>
      <Button :disabled="loading" :loading :loading-text @click="doDelete">
        <div flex="~ center gap-x-2">
          <div i-carbon-reset text-5 />
          {{ $t('startDelete.common') }}
        </div>
      </Button>
    </div>
  </div>
</template>

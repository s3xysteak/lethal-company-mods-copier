<script setup lang="ts">
import { open } from '@tauri-apps/plugin-dialog'
import { normalize } from 'pathe'

const base = defineModel<string>({ required: true })

const { t } = useI18n()

async function pick() {
  const file = await open({
    multiple: false,
    directory: true,
  })

  if (file)
    base.value = normalize(file)
}

const isCurrentFolder = computed(() => base.value.startsWith('.') || base.value.startsWith('./'))
</script>

<template>
  <div flex="~ justify-between" w-0>
    <p
      class="path"
      flex="~ items-center" grow overflow-x-scroll px-6 text-nowrap
      :class="isCurrentFolder && 'c-gray'"
    >
      {{ isCurrentFolder ? t('currentFolder') : base }}
    </p>

    <div class="tooltip" :data-tip="t('modsFolder')">
      <button class="btn" rounded-l-none @click="pick">
        <div i-carbon-folder />
      </button>
    </div>
  </div>
</template>

<style scoped>
.path::-webkit-scrollbar {
  display: none;
}
</style>

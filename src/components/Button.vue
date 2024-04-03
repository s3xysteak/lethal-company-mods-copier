<script setup lang="ts">
defineProps<{
  loading?: boolean
  loadingText?: string
}>()

const { t } = useI18n()
</script>

<template>
  <button class="btn">
    <div v-show="loading" flex="~ center gap-x-2">
      <div class="loading" />
      <div>
        {{ loadingText ?? t('loading') }}
      </div>
    </div>

    <div v-show="!loading">
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
import { config } from '~/stores/config'

import { fullPath } from './utils/path'

const loading = ref(true)
const error = ref<Error>()

fetch(fullPath('/config.json')).then(res => res.json()).then((data) => {
  config.value = data
  loading.value = false
}).catch((err) => {
  error.value = err
})

if (import.meta.env.PROD) {
  window.oncontextmenu = (e) => {
    e.preventDefault()
  }
}
</script>

<template>
  <error-alert :error />
  <Suspense>
    <router-view v-if="!loading" />
  </Suspense>
  <spin :loading dot />
</template>

<style>
html,
body,
#app {
  @apply h-full;
}
</style>

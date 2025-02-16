export const config = ref<any>({})
export const title = ref(document.title)

const apiDefault = { default: '//api' }
export const apiConfig = ref<any>(apiDefault)

watch(config, (cfg: any) => {
  if (!cfg) return
  if (cfg.title)
    title.value = cfg.title
  if (cfg.api) {
    apiConfig.value = {
      ...apiDefault,
      ...cfg.api,
    }
  }
})

watch(title, (title) => {
  document.title = title
})

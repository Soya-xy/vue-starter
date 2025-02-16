import type { Options } from 'unplugin-auto-import/types'
import type { BuildOptions } from 'vite'

import { VueRouterAutoImports } from 'unplugin-vue-router'

export const imports: Options = {
  imports: [
    'vue',
    VueRouterAutoImports,
    '@vueuse/core',
    {
      'alova/client': [
        'useRequest',
        'useWatcher',
        'useFetcher',
        'usePagination',
        'accessAction',
        'actionDelegationMiddleware',
      ],
      'alova': [
        'queryCache',
        'invalidateCache',
      ],
    },
  ],
}

export const build: BuildOptions = {
  rollupOptions: {
    output: {
      manualChunks: {
        util: ['dayjs', 'ramda', 'pathe', 'ufo', 'uuid', 'pretty-bytes'],
        turf: ['@turf/turf', '@turf/helpers'],
        vue: ['vue', 'vue-router', '@vueuse/core', '@vueuse/components', '@vueuse/integrations'],
        ui: [
        ],
        ajax: ['alova', '@alova/scene-vue'],
      },
    },
  },
}

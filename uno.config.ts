import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { safelist } from './uno.safelist'

export default defineConfig({
  safelist,
  shortcuts: [
    ['horz', 'flex items-center'],
    ['sx-1', 'space-x-1'],
    ['sx-2', 'space-x-2'],
    ['sx-3', 'space-x-3'],
    ['sx-4', 'space-x-4'],
    ['vert', 'flex flex-col'],
    ['sy-1', 'space-y-1'],
    ['sy-2', 'space-y-2'],
    ['sy-3', 'space-y-3'],
    ['sy-4', 'space-y-4'],
    ['hand', 'cursor-pointer'],
    ['nowrap', 'whitespace-nowrap'],
    ['center', 'flex items-center justify-center'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})

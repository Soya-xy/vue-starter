import type { ProxyOptions, UserConfig } from 'vite'

import { cwd } from 'node:process'

import { loadEnv } from 'vite'

interface ProxyConfig {
  // 环境变量名称
  env: string
  // 默认值
  default?: string
  // 反代路由前缀
  prefix: string
  // 路由前缀替换
  regexp?: string
  // 启用WebSocket
  ws?: boolean
}

export function viteProxy({ mode = 'development' }: UserConfig) {
  const env = loadEnv(mode, cwd(), '')

  const proxies: ProxyConfig[] = [{
    env: 'API_SERVER',
    prefix: `/api/`,
  }]

  function proxyUrl(envName: string, defaultUrl?: string) {
    let url = env[envName] || defaultUrl
    if (!url) throw new Error(`缺少${envName}配置`)

    if (!url.startsWith('http://') && !url.startsWith('https://')
      && !url.startsWith('ws://') && !url.startsWith('wss://')) {
      url = `http://${url}`
    }
    return url
  }

  return proxies.reduce((result, item) => {
    const { prefix, regexp, ws } = item
    const replace = new RegExp(`^${regexp || prefix}`)
    result[prefix] = {
      target: proxyUrl(item.env, item.default),
      rewrite: env[`${item.env}_PROD`] ? undefined : path => path.replace(replace, ''),
      changeOrigin: true,
      ws,
    }
    return result
  }, {} as Record<string, string | ProxyOptions>)
}

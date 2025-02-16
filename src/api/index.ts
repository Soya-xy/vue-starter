import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { isEmpty } from 'ramda'
import { joinURL } from 'ufo'

import { apiConfig } from '~/stores/config'
import { gotoLogin } from '~/utils/login'
import { fullPath } from '~/utils/path'

export function getApiServer() {
  const { VITE_API_SERVER = apiConfig.value.default || '//api' } = import.meta.env || {}
  return VITE_API_SERVER
}

class RestError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

export function createAjax(apiPath: string = '', apiServer?: string) {
  const baseURL = joinURL(apiServer || getApiServer(), apiPath)

  const alovaInstance = createAlova({
    baseURL: fullPath(baseURL),
    statesHook: VueHook,
    requestAdapter: adapterFetch(),
    async responded(res: Response, method) {
      const contentType = res.headers.get('content-type')
      const isJson = contentType?.includes('json')
      if (!res.ok) {
        if (res.status === 401) gotoLogin()
        if (!isJson) {
          throw new RestError(res.statusText, res.status)
        }
        let data: any
        try {
          data = await res.json()
        }
        catch (err: any) {
          throw new RestError(err.message, res.status)
        }
        const { message = res.statusText } = data || {}
        throw new RestError(message, res.status)
      }
      const length = res.headers.get('content-length')
      if (length && Number.parseInt(length) === 0) {
        return
      }
      switch (method.meta?.type) {
        case 'text':
          return res.text()
        case 'blob':
          return res.blob()
        default:
          if (!isJson) {
            throw new Error(`未知类型：${contentType}`)
          }
          return res.json()
      }
    },
    cacheLogger: import.meta.env?.DEV,
  })

  return alovaInstance
}

export default createAjax()

// 本地文件（/public/*）访问工具
export const loader = createAjax('', '/')

export function fullApiPath(path: string, search?: string | Record<string, string>) {
  const url = joinURL(fullPath(getApiServer()), path)
  if (search && !isEmpty(search)) {
    const qs = new URLSearchParams(search)
    return `${url}?${qs.toString()}`
  }
  return url
}

export type AlovaTransform = (data: any, headers: Headers) => any

import type { AlovaGenerics, Method } from 'alova'

import { updateState } from 'alova/client'

export function useCacheSync(api: Method<AlovaGenerics<any>>, idName: string = 'id') {
  async function syncCache(
    item: any,
    action: (data: any[], index: number) => void,
    id?: any,
  ) {
    try {
      return await updateState(api, (oldData: any) => {
        let data = oldData || []
        let dataKey
        if (typeof oldData === 'object') {
          // 可能是{data: [], total: 0}
          for (const key in oldData) {
            if (Array.isArray(oldData[key])) {
              dataKey = key
              data = oldData[key]
              break
            }
          }
        }
        const index = data.findIndex((x: any) => x[idName] === (id || item[idName]))
        action(data, index)
        if (dataKey) {
          return { ...oldData, [dataKey]: data }
        }
        return data
      })
    }
    catch (err) {
      console.error('[syncCache]', idName, '=', id, err)
    }
  }

  async function syncCreate(item: any) {
    return await syncCache(item, (data: any[]) => {
      data.splice(0, 0, item)
    })
  }

  async function syncUpdate(item: any, id: any) {
    return await syncCache(item, (data: any[], index: number) => {
      if (index > -1) data.splice(index, 1, item)
    }, id)
  }

  async function syncRemove(item: any, id: any) {
    return await syncCache(item, (data: any[], index: number) => {
      if (index > -1) data.splice(index, 1)
    }, id)
  }

  return { syncCreate, syncUpdate, syncRemove }
}

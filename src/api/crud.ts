import type { AlovaTransform } from '.'
import type { PagedResult, QueryParams } from './common/query'

import { v4 } from 'uuid'

import { createAjax } from '.'
import { makePageParams } from './common/query'

export interface CrudApiOptions {
  apiPath?: string
  apiServer?: string
  idName?: string
}

export function removeNull<T extends Record<string, any>>(data: T) {
  const result = data
  for (const key in result) {
    if (result[key] === null) {
      delete result[key]
    }
  }
  return result
}

export function crudApi<T extends Record<string, any>>(name: string, options: CrudApiOptions = {}) {
  const api = createAjax(options.apiPath || name, options.apiServer)

  const { idName = 'id' } = options

  function getAll(params?: QueryParams, transform?: AlovaTransform) {
    return api.Get<T[]>('', { params, hitSource: name, transform })
  }

  function getPaged(page: number = 1, pageSize: number = 10, params?: QueryParams) {
    return api.Get<PagedResult<T>>('', {
      params: {
        ...params,
        ...makePageParams(page, pageSize),
      },
      hitSource: name,
    })
  }

  function getById(id: string, params?: any) {
    return api.Get<T>(id, { params })
  }

  function create(data: T) {
    if (!data[idName])
      // @ts-expect-error 2862
      data[idName] = v4()
    return api.Post('', data, { name })
  }

  function update(id: string, data: Partial<T>) {
    return api.Put(id, removeNull(data), { name })
  }

  function remove(id: string) {
    return api.Delete(id, {}, { name })
  }

  return {
    api,
    getAll,
    getPaged,
    getById,
    create,
    update,
    remove,
  }
}

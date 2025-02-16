export interface PageParams {
  _page?: number
  _count?: number
}

export interface QueryParams {
  _field?: string
  _order?: string
  _with?: string
  [key: string]: any
}

export interface PagedResult<T extends Record<string, any>> {
  data: Array<T>
  total: number
}

export function makePageParams(page: number = 1, pageSize: number = 10) {
  return {
    _page: page,
    _count: pageSize,
  } as PageParams
}

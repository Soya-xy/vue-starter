import type { Ref } from 'vue'

import { useCacheSync } from '~/api/cache'

interface Actions<T> {
  loader?: any
  reload?: any
  create?: any
  update?: any
  remove?: any
  idName?: string
  currentItem?: Ref<T | undefined> // 用于删除操作时同步清空
  onSuccess?: any
  onError?: any
}

export function useAction<T>(options: Actions<T>, idRef?: Ref<any>) {
  // 操作成功后无条件刷新数据列表
  const reload = async (...args: any) => {
    if (options.reload) {
      try {
        await (options.reload.value || options.reload)()
      }
      catch (err) {
        console.error(err)
        // TODO:这里要弹窗提示出来
      }
    }
    return args
  }

  const { onSuccess = reload, onError: doError } = options

  // 异常返回false，用于通知表单不关闭
  function onError(err: any) {
    doError(err)
    return false
  }

  // 增删改操作选项兼容Ref格式，并严格遵循特定的参数列表
  const create = async (data: T) => await (options.create.value || options.create)(data)
  const update = async (id: any, data: Partial<T>) => await (options.update.value || options.update)(id, data)
  const remove = async (id: any, data?: T) => await (options.remove.value || options.remove)(id, data)

  const { idName = 'id', currentItem: current } = options
  // @ts-expect-error 7053
  const idOf = (data?: Partial<T>) => data ? data[idName] : undefined
  const getId = (data?: Partial<T>) => idRef ? idRef.value : idOf(data)
  const hasId = (id: any) => id === 0 || id

  // 操作成功后执行alova缓存更新
  function getCacheSync() {
    const cb = options.loader ? options.loader.value || options.loader : undefined
    const sync = typeof cb === 'function' ? useCacheSync(cb(), idName) : undefined
    return sync
  }

  const busy = ref(false)
  const busyCreate = ref(false)
  const busyUpdate = ref(false)
  const busySubmit = ref(false)
  const busyRemove = ref(false)

  function clearBusy() {
    busy.value = false
    busyCreate.value = false
    busyUpdate.value = false
    busySubmit.value = false
    busyRemove.value = false
  }

  function doCreate(data: T) {
    if (!options.create)
      return onError(new Error('没有提供新建操作'))
    busy.value = true
    busyCreate.value = true
    busySubmit.value = true
    return create(data).then(async (result) => {
      const sync = getCacheSync()
      await sync?.syncCreate(data)
      return onSuccess(data, result)
    }).catch(onError).finally(clearBusy)
  }

  function doUpdate(data: Partial<T>, id?: any) {
    if (!options.update)
      return onError(new Error('没有提供修改操作'))
    if (!id) {
      id = getId(data)
      if (!hasId(id))
        return onError(new Error('缺少主键'))
    }
    busy.value = true
    busyUpdate.value = true
    busySubmit.value = true
    return update(id, data).then(async (result) => {
      // @ts-expect-error 7053
      if (current?.value && current.value[idName] === id)
        current.value = { ...current.value, ...data }
      const sync = getCacheSync()
      await sync?.syncUpdate(data, id)
      return onSuccess(data, result, id)
    }).catch(onError).finally(clearBusy)
  }

  function doSubmit(data: T) {
    const id = getId(data)
    if (hasId(id)) {
      return doUpdate(data, id)
    }
    else {
      return doCreate(data)
    }
  }

  function doRemove(data?: T) {
    if (!options.remove)
      return onError(new Error('没有提供删除操作'))
    const id = idOf(data)
    if (!hasId(id))
      return onError(new Error('缺少主键'))
    busy.value = true
    busyRemove.value = true
    return remove(id, data).then(async (result) => {
      // @ts-expect-error 7053
      if (current?.value && current.value[idName] === id)
        current.value = undefined
      const sync = getCacheSync()
      await sync?.syncRemove(data, id)
      return onSuccess(data, result, id)
    }).catch(onError).finally(clearBusy)
  }

  return {
    busy,
    doCreate,
    doUpdate,
    doSubmit,
    doRemove,
    busyCreate,
    busyUpdate,
    busySubmit,
    busyRemove,
  }
}

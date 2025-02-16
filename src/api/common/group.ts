import { joinURL } from 'ufo'
import { v4 } from 'uuid'

import { createAjax } from '..'

export interface Group {
  id: string
  name: string
  type: string
  parent?: string
  index?: number
  xid?: string
  note?: string
}

const groupCache = (group: Partial<Group>) => `group/${group.parent || ''}`
const groupItemCache = (groupId: string) => `group/${groupId}/items`

const groupItemURL = (groupId: string) => joinURL(groupId, 'items')

export function makeGroupApi<ItemType>(apiPath: string, apiServer?: string) {
  const api = createAjax(apiPath, apiServer)

  function getGroup(parent?: string, type?: string) {
    return api.Get<Group[]>('', {
      params: { parent, type },
      hitSource: `group/${parent || ''}`,
      // @ts-expect-error 2322
      transform(data: Group[]) {
        return data.sort((a, b) => (a.index || 0) - (b.index || 0))
      },
    })
  }

  function createGroup(group: Group) {
    if (!group.id) group.id = v4()
    if (!group.parent) delete group.parent
    return api.Post('', group, { name: groupCache(group) })
  }

  function updateGroup(id: string, group: Partial<Group>) {
    if (!group.parent) delete group.parent
    return api.Put(id, group, { name: groupCache(group) })
  }

  function removeGroup(id: string, group: Group) {
    return api.Delete(id, {}, { name: groupCache(group) })
  }

  function getGroupItems(id: string) {
    return api.Get<ItemType[]>(groupItemURL(id), { hitSource: groupItemCache(id) })
  }

  function getGroupItem(id: string, item: string) {
    return api.Get<ItemType>(joinURL(id, item))
  }

  function addGroupItem(id: string, item: string) {
    return api.Post(joinURL(id, item), {}, { name: groupItemCache(id) })
  }

  function addGroupItems(id: string, items: string[]) {
    return api.Post(groupItemURL(id), { items }, { name: groupItemCache(id) })
  }

  function removeGroupItem(id: string, item: string) {
    return api.Delete(joinURL(id, item), {}, { name: groupItemCache(id) })
  }

  function removeGroupItems(id: string, items: string[]) {
    return api.Delete(groupItemURL(id), { items }, { name: groupItemCache(id) })
  }

  function clearGroupItems(id: string) {
    return api.Delete(groupItemURL(id), {}, { name: groupItemCache(id) })
  }

  return {
    getGroup,
    createGroup,
    updateGroup,
    removeGroup,
    getGroupItems,
    getGroupItem,
    addGroupItem,
    addGroupItems,
    removeGroupItem,
    removeGroupItems,
    clearGroupItems,
  }
}

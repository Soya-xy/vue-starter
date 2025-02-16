import type { Ref } from 'vue'

interface TreeOptions {
  id?: string
  pid?: string
  children?: string
}

const defaultOptions = {
  id: 'id',
  pid: 'parent',
  children: 'children',
}

interface MakeTreeOptions extends TreeOptions {
  sortBy?: string | null
}

export function useTree(options?: MakeTreeOptions) {
  const o = { ...defaultOptions, sortBy: 'index', ...options }

  function makeTreeCache(data: any[]) {
    const cache: any = {}
    for (const item of data) {
    // data有可能是深度响应式变量，可能重复添加children
      item[o.children] = []
      cache[item[o.id]] = item
    }
    return cache
  }

  function makeTree(data: any[], cache?: any): any[] {
    if (!data?.length) return []

    // 建索引
    if (!cache) cache = makeTreeCache(data)

    function levelOf(item: any, level = 0) {
      const pid = item[o.pid]
      if (pid) {
        const parent = cache[pid]
        if (parent)
          return levelOf(parent, level + 1)
      }
      return level
    }

    // 查层级
    const levels: any[] = []
    let maxLevel = 0
    for (const item of data) {
      const level = levelOf(item)
      if (!levels[level]) levels[level] = {}
      levels[level][item[o.id]] = item
      if (level > maxLevel) maxLevel = level
    }

    // 挂节点
    for (let i = maxLevel; i > 0; i--) {
      const parents = levels[i - 1]
      const children = levels[i]
      for (const id in children) {
        const child = children[id]
        const pid = child[o.pid]
        const parent = parents[pid]
        if (!parent[o.children])
          parent[o.children] = []
        parent[o.children].push(child)
      }
    }

    // 排序
    let sorter: ((a: any, b: any) => number) | undefined
    const { sortBy } = o
    if (sortBy) {
      sorter = (a: any, b: any) => (a[sortBy] || 0) - (b[sortBy] || 0)
      for (let i = 0; i < maxLevel; ++i) {
        for (const parent of Object.values<any>(levels[i])) {
          if (parent[o.children]?.length > 1)
            parent[o.children].sort(sorter)
        }
      }
    }

    // 转数组
    const result = []
    for (const id in levels[0])
      result.push(levels[0][id])

    return sorter ? result.sort(sorter) : result
  }

  function findNodeById<T extends Record<string, any>>(tree: T[], id: string): T | undefined {
    for (const node of tree) {
      if (node[o.id] === id) {
        return node
      }
      if (Array.isArray(node[o.children]) && node[o.children].length > 0) {
        const result = findNodeById(node[o.children], id)
        if (result) return result as T
      }
    }
  }

  function pathTo(node: any, dataOrCache: any, parentOnly?: boolean) {
    const cache = Array.isArray(dataOrCache) ? makeTreeCache(dataOrCache) : dataOrCache

    const parents: any[] = []

    function parentsOf(item: any) {
      const pid = item[o.pid]
      if (pid) {
        const parent = cache[pid]
        if (parent) {
          parents.push(parent)
          parentsOf(parent)
        }
        else {
          console.warn('找不到上级节点', pid, item)
        }
      }
    }

    parentsOf(node)
    const reversed = parents.reverse()
    return parentOnly ? reversed : reversed.concat(node)
  }

  function allChildren(node: any, includeSelf?: boolean) {
    const children: any[] = []

    function childrenOf(item: any) {
      if (item[o.children]?.length) {
        for (const child of item[o.children]) {
          children.push(child)
          childrenOf(child)
        }
      }
    }

    childrenOf(node)
    return includeSelf ? [node, ...children] : children
  }

  return {
    makeTree,
    makeTreeCache,
    findNodeById,
    pathTo,
    allChildren,
  }
}

export function watchTree(data: Ref<any[]>, options?: MakeTreeOptions) {
  const tree = useTree(options)
  const treeData = ref<any[]>([])

  const cache = ref<any>({})

  watch(data, (data) => {
    cache.value = tree.makeTreeCache(data)
    treeData.value = tree.makeTree(data, cache.value)
  })

  function pathTo(node: any, parentOnly?: boolean) {
    return tree.pathTo(node, cache.value, parentOnly)
  }

  function findNodeById(id: string) {
    return tree.findNodeById(data.value, id)
  }

  return { ...tree, treeData, pathTo, findNodeById }
}

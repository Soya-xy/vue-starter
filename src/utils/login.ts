import type { RouteLocationNormalizedGeneric, Router } from 'vue-router'

import { loginTo } from '~/stores/login'

const loginName = '/login'
const loginHash = `#${loginName}`

export function gotoLogin(router?: Router, route?: RouteLocationNormalizedGeneric, logout?: boolean) {
  if (router && route) {
    if (route.name !== loginName) {
      loginTo.value = logout ? null : route.name?.toString()
      router.push(loginName)
    }
  }
  else if (window.location.hash !== loginHash) {
    loginTo.value = logout ? null : window.location.hash.substring(1)
    window.location.hash = loginHash
  }
}

export function loginReturn(router: Router) {
  router.push(loginTo.value || '/')
  loginTo.value = null
}

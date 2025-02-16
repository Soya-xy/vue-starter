import api from '.'

export interface LoginAccount {
  username: string
  password: string
  md5?: boolean
}

export function login(account: LoginAccount) {
  return api.Post('/login', account)
}

export function logout() {
  return api.Post('/logout', {})
}

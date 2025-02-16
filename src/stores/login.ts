export interface LoginUser {
  org?: string
  user: string
  name: string
  role: string
  token?: string
}

export const loginUser = ref<LoginUser | null>()

// cookies.addChangeListener(({ name, value }) => {
//   if (name === jwtCookie) syncJwtCookie(value)
// })

export const loginTo = useSessionStorage<string>('login-to', null)

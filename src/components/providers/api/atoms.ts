import Kitsu from "kitsu"
import { selector } from "recoil"
import { authActions, authState } from "../auth/atoms"

export const apiSelector = selector({
  key: "apiSelector",
  get: ({ get }) => {
    const auth = get(authState)
    const { logout } = get(authActions)
    const authHeader = auth?.token ? `Bearer ${auth.token}` : undefined
    if (!import.meta.env.VITE_APP_API_URL)
      throw new Error("VITE_APP_API_URL is not defined")
    const baseURL = `${import.meta.env.VITE_APP_API_URL}/api`

    if (authHeader) {
      const api = new Kitsu({
        baseURL,
        headers: {
          Authorization: authHeader,
        },
      })

      api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            logout()
          }
          return Promise.reject(error)
        },
      )

      return api
    }

    const api = new Kitsu({
      camelCaseTypes: true,
      baseURL,
    })

    return api
  },
})

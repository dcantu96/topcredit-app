import Kitsu from "kitsu"
import { selector } from "recoil"
import { authState } from "../auth/atoms"

export const apiSelector = selector({
  key: "apiSelector",
  get: ({ get }) => {
    const auth = get(authState)
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

      return api
    }

    const api = new Kitsu({
      camelCaseTypes: true,
      baseURL,
    })

    return api
  },
})

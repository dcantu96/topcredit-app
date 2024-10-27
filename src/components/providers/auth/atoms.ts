import { atom, selector } from "recoil"
import { ROLES } from "../../../constants"
import type { MeResponse, TokenResponse } from "src/schema.types"

interface AuthState {
  email: string
  token: string
  createdAt: number
  expiresIn: number
}

const authInitializer = selector<AuthState | undefined>({
  key: "authInitializer",
  get: () => {
    // 0. check if auth is in local storage
    const localAuth = localStorage.getItem("auth")

    if (!localAuth) {
      return undefined
    }

    // 1. check ig localAuth is a valid auth state object
    const authJson = JSON.parse(localAuth)

    if (!isValidAuthObject(authJson)) {
      return undefined
    }

    // 2. if valid, check if token is expired
    if (
      new Date(authJson.createdAt * 1000).getTime() +
        authJson.expiresIn * 1000 <
      new Date().getTime()
    ) {
      return undefined
    } else {
      return authJson
    }
  },
})

export const authState = atom<AuthState | undefined>({
  key: "authState",
  default: authInitializer,
  effects: [
    ({ onSet }) => {
      onSet((newAuthState) => {
        if (newAuthState) {
          localStorage.setItem("auth", JSON.stringify(newAuthState))
        } else {
          localStorage.removeItem("auth")
        }
      })
    },
  ],
})

function isValidAuthObject(authJson: unknown): authJson is AuthState {
  return (
    typeof authJson === "object" &&
    authJson !== null &&
    "email" in authJson &&
    "token" in authJson &&
    "createdAt" in authJson &&
    "expiresIn" in authJson
  )
}

export const authActions = selector({
  key: "authActions",
  get: ({ getCallback }) => {
    const login = getCallback(
      ({ set }) =>
        async (email: string, password: string) => {
          // 1. send login request to server

          const response = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/oauth/token`,
            {
              method: "POST",
              body: JSON.stringify({
                grant_type: "password",
                client_id: import.meta.env.VITE_APP_CLIENT_ID,
                client_secret: import.meta.env.VITE_APP_CLIENT_SECRET,
                email,
                password,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            },
          )

          const data = await response.json()
          if (data.error) {
            if (data.error === "invalid_client") {
              throw new Error(
                "Hubo un problema. Favor de Notificar al Administrador",
              )
            }
            if (data.error === "invalid_grant") {
              throw new Error("Credenciales inválidas")
            }
          }

          if (isValidAuthResponseObject(data)) {
            set(authState, {
              email,
              token: data.access_token,
              createdAt: data.created_at,
              expiresIn: data.expires_in,
            })
          } else {
            throw new Error(
              "Hubo un problema. Favor de Notificar al Administrador",
            )
          }
        },
    )
    const logout = getCallback(({ set }) => () => {
      set(authState, undefined)
    })

    return {
      login,
      logout,
    }
  },
})

export const isLoggedInState = selector({
  key: "isLoggedInState",
  get: async ({ get }) => {
    const auth = get(authState)
    if (!auth) return false
    const profile = get(myProfileState)

    return !!profile
  },
})

export const myProfileState = selector<MeResponse | undefined>({
  key: "myProfileState",
  get: async ({ get }) => {
    const auth = get(authState)
    const { logout } = get(authActions)

    if (auth) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/me`,
          {
            method: "GET",
            headers: {
              Accept: "application/vnd.api+json",
              "Content-Type": "application/vnd.api+json",
              Authorization: `Bearer ${auth.token}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error(
            "Hubo un problema. Favor de Notificar al Administrador",
          )
        }
        const data = await response.json()
        return data
      } catch {
        logout()
      }
    } else {
      logout()
      return undefined
    }
  },
})

export const showDashboardSidebarSelector = selector({
  key: "showDashboardSidebarSelector",
  get: ({ get }) => {
    const profile = get(myProfileState)

    return (
      profile?.roles &&
      (profile?.roles.includes("admin") || profile.roles.length > 1)
    )
  },
})

export const userRolesState = selector({
  key: "userRolesState",
  get: ({ get }) => {
    const profile = get(myProfileState)
    if (profile?.roles.includes("admin")) return ROLES
    return ROLES.filter((role) => profile?.roles.includes(role.value))
  },
})

export const isUserAdminSelector = selector({
  key: "isUserAdminSelector",
  get: ({ get }) => {
    const profile = get(myProfileState)
    return profile?.roles.includes("admin") || false
  },
})

export const hasNoRolesState = selector({
  key: "hasNoRolesState",
  get: ({ get }) => {
    const profile = get(myProfileState)
    return profile?.roles.length === 0
  },
})

const isValidAuthResponseObject = (
  authJson: unknown,
): authJson is TokenResponse => {
  return (
    typeof authJson === "object" &&
    authJson !== null &&
    "token_type" in authJson &&
    "access_token" in authJson &&
    "created_at" in authJson &&
    "expires_in" in authJson
  )
}

export const signNowTokenSelector = selector({
  key: "signNowTokenSelector",
  get: async () => {
    const maybeToken = localStorage.getItem("sign-now-token")
    if (maybeToken && isValidSignNowTokenResponse(JSON.parse(maybeToken))) {
      try {
        const token = JSON.parse(maybeToken) as SignNowTokenResponse
        const response = await fetch("https://api.signnow.com/oauth2/token", {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token.access_token}`,
          },
        })
        const data = await response.json()
        if (data.error) {
          // delay 500ms
          await new Promise((resolve) => setTimeout(resolve, 5000))
          localStorage.removeItem("sign-now-token")
          window.location.href = `https://app.signnow.com/authorize?client_id=${import.meta.env.VITE_APP_SIGN_NOW_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_APP_REDIRECT_URI}`
        } else {
          localStorage.setItem("sign-now-token", JSON.stringify(data))
          return data
        }
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        localStorage.removeItem("sign-now-token")
        window.location.href = `https://app.signnow.com/authorize?client_id=${import.meta.env.VITE_APP_SIGN_NOW_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_APP_REDIRECT_URI}`
      }
    } else if (window.location.search.length === 0) {
      window.location.href = `https://app.signnow.com/authorize?client_id=${import.meta.env.VITE_APP_SIGN_NOW_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_APP_REDIRECT_URI}`
    } else {
      const code = new URLSearchParams(window.location.search).get("code")
      if (code) {
        try {
          const response = await fetch("https://api.signnow.com/oauth2/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${import.meta.env.VITE_APP_BASIC_AUTH}`,
            },
            body: `grant_type=authorization_code&code=${code}&scope=*`,
          })
          const data = await response.json()
          if (data.errors) {
            await new Promise((resolve) => setTimeout(resolve, 5000))
            localStorage.removeItem("sign-now-token")
            window.location.href = `https://app.signnow.com/authorize?client_id=${import.meta.env.VITE_APP_SIGN_NOW_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_APP_REDIRECT_URI}`
          } else {
            localStorage.setItem("sign-now-token", JSON.stringify(data))
            return data as SignNowTokenResponse
          }
          return data
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          localStorage.removeItem("sign-now-token")
          window.location.href = `https://app.signnow.com/authorize?client_id=${import.meta.env.VITE_APP_SIGN_NOW_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_APP_REDIRECT_URI}`
        }
      }
    }
  },
})

export const signNowTokenState = atom({
  key: "signNowTokenState",
  default: signNowTokenSelector,
  effects: [
    ({ onSet }) => {
      onSet((newToken) => {
        if (newToken) {
          localStorage.setItem("sign-now-token", JSON.stringify(newToken))
        } else {
          localStorage.removeItem("sign-now-token")
        }
      })
    },
  ],
})

interface SignNowTokenResponse {
  expires_in: number
  token_type: string
  access_token: string
  refresh_token: string
  scope: string
  last_login: number
}

const isValidSignNowTokenResponse = (
  token: unknown,
): token is SignNowTokenResponse => {
  return (
    typeof token === "object" &&
    token !== null &&
    "expires_in" in token &&
    "token_type" in token &&
    "access_token" in token &&
    "refresh_token" in token &&
    "scope" in token &&
    "last_login" in token
  )
}

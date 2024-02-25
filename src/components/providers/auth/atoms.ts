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
    console.log("authState effect")
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
    console.log("auth state in isLoggedInState", auth)
    if (!auth) return false
    console.log("auth state in isLoggedInState", auth)
    const profile = get(myProfileState)
    console.log("profile state in isLoggedInState", profile)
    return !!profile
  },
})

export const myProfileState = selector<MeResponse | undefined>({
  key: "myProfileState",
  get: async ({ get }) => {
    const auth = get(authState)
    console.log("auth state in myProfileState", auth)
    const { logout } = get(authActions)
    if (auth) {
      try {
        console.log("fetch me request")
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
      } catch (error) {
        console.log(error)
        logout()
      }
    } else {
      console.log("no auth, logout")
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
    console.log(profile?.roles)
    return ROLES.filter((role) => profile?.roles.includes(role.value))
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

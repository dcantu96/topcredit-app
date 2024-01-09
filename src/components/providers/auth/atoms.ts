import { atom, selector } from "recoil";

interface AuthState {
  email: string;
  /**
   * Bearer token
   */
  token: string;
  createdAt: number;
  expiresIn: number;
}

export const authState = atom<AuthState | undefined>({
  key: "authState",
  default: undefined,
  effects: [
    ({ setSelf, node, getLoadable }) => {
      // 0. check if auth is in local storage
      const localAuth = localStorage.getItem("auth");
      const authInitialValue = getLoadable(node).getValue();
      if (localAuth && !authInitialValue) {
        // 1. check ig localAuth is a valid auth state object
        const authJson = JSON.parse(localAuth);
        if (isValidAuthObject(authJson)) {
          // 2. if valid, check if token is expired
          if (
            new Date(authJson.createdAt * 1000).getTime() +
              authJson.expiresIn * 1000 <
            new Date().getTime()
          ) {
            localStorage.removeItem("auth");
          } else {
            setSelf(authJson);
          }
        } else {
          // 5. if not valid, remove auth from local storage
          localStorage.removeItem("auth");
        }
      }
    },
    ({ onSet }) => {
      onSet((newAuthState) => {
        if (newAuthState) {
          localStorage.setItem("auth", JSON.stringify(newAuthState));
        } else {
          localStorage.removeItem("auth");
        }
      });
    },
  ],
});

function isValidAuthObject(authJson: unknown): authJson is AuthState {
  return (
    typeof authJson === "object" &&
    authJson !== null &&
    "email" in authJson &&
    "token" in authJson &&
    "createdAt" in authJson &&
    "expiresIn" in authJson
  );
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
            }
          );

          const data = await response.json();
          if (data.error) {
            if (data.error === "invalid_client") {
              throw new Error(
                "Hubo un problema. Favor de Notificar al Administrador"
              );
            }
            if (data.error === "invalid_grant") {
              throw new Error("Credenciales inválidas");
            }
          }

          if (isValidAuthResponseObject(data)) {
            set(authState, {
              email,
              token: data.access_token,
              createdAt: data.created_at,
              expiresIn: data.expires_in,
            });
          } else {
            throw new Error(
              "Hubo un problema. Favor de Notificar al Administrador"
            );
          }
        }
    );
    const logout = getCallback(({ reset }) => () => {
      reset(authState);
    });

    return {
      login,
      logout,
    };
  },
});

export const isLoggedInState = selector({
  key: "isLoggedInState",
  get: ({ get }) => {
    const auth = get(authState);
    return !!auth;
  },
});

interface AuthResponse {
  token_type: string;
  access_token: string;
  created_at: number;
  expires_in: number;
}

const isValidAuthResponseObject = (
  authJson: unknown
): authJson is AuthResponse => {
  return (
    typeof authJson === "object" &&
    authJson !== null &&
    "token_type" in authJson &&
    "access_token" in authJson &&
    "created_at" in authJson &&
    "expires_in" in authJson
  );
};

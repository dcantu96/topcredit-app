import { useRecoilValue } from "recoil"
import { authState } from "./atoms"

export const useAuth = () => {
  const auth = useRecoilValue(authState)
  if (!auth) throw new Error("auth is not initialized")
  return auth
}

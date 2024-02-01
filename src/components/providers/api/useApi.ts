import { useRecoilValue } from "recoil"
import { apiSelector } from "./atoms"

export const useApi = () => {
  return useRecoilValue(apiSelector)
}

import { atom } from "recoil"
import type { Toast } from "./types"

export const toastState = atom<Toast | undefined>({
  key: "toastState",
  default: undefined,
})

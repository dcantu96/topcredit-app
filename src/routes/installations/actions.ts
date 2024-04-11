import { useRecoilCallback } from "recoil"

import { installationsState } from "./atoms"

export const useInstallationsActions = (status: null | "installed") => {
  const removeCredit = useRecoilCallback(
    ({ set }) =>
      async (creditId: string) => {
        set(installationsState(status), (credits) =>
          credits.filter((credit) => credit.id !== creditId),
        )
      },
  )

  return {
    removeCredit,
  }
}

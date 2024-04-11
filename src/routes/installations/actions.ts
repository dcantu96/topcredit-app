import { useRecoilCallback } from "recoil"

import { installationsState } from "./atoms"

export const useInstallationsActions = () => {
  const removeCredit = useRecoilCallback(
    ({ set }) =>
      async (creditId: string) => {
        set(installationsState, (credits) =>
          credits.filter((credit) => credit.id !== creditId),
        )
      },
  )

  return {
    removeCredit,
  }
}

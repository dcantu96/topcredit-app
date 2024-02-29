import { useRecoilCallback } from "recoil"

import { pendingAuthorizationsState } from "./atoms"

export const usePendingAuthorizationsActions = () => {
  const removeCredit = useRecoilCallback(
    ({ set }) =>
      async (creditId: string) => {
        set(pendingAuthorizationsState, (credits) =>
          credits.filter((credit) => credit.id !== creditId),
        )
      },
  )

  return {
    removeCredit,
  }
}

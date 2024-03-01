import { useRecoilCallback } from "recoil"

import { dispersionsState } from "./atoms"

export const useDispersionsActions = () => {
  const removeCredit = useRecoilCallback(
    ({ set }) =>
      async (creditId: string) => {
        set(dispersionsState, (credits) =>
          credits.filter((credit) => credit.id !== creditId),
        )
      },
  )

  return {
    removeCredit,
  }
}

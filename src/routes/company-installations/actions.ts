import { useRecoilCallback } from "recoil"

import { companyCreditsState } from "./atoms"

export const useCompanyCreditsActions = () => {
  const removeCredit = useRecoilCallback(
    ({ set }) =>
      async (creditId: string) => {
        set(companyCreditsState, (credits) =>
          credits.filter((credit) => credit.id !== creditId),
        )
      },
  )

  return {
    removeCredit,
  }
}

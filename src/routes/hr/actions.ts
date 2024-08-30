import { useRecoilCallback } from "recoil"

import { hrCreditsState, HRCreditViewMode } from "./atoms"
import { notificationsSelector } from "components/organisms/activity-container/atoms"

export const useHRActions = (mode: HRCreditViewMode) => {
  const removeCredit = useRecoilCallback(
    ({ set, refresh }) =>
      async (creditId: string) => {
        set(hrCreditsState(mode), (credits) =>
          credits.filter((credit) => credit.id !== creditId),
        )
        refresh(notificationsSelector(["DispersedCredit", "AuthorizedCredit"]))
      },
  )

  return {
    removeCredit,
  }
}

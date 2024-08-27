import { useRecoilCallback } from "recoil"

import { hrCreditsState } from "./atoms"
import { notificationsSelector } from "components/organisms/activity-container/atoms"

export const useHRActions = () => {
  const removeCredit = useRecoilCallback(
    ({ set, refresh }) =>
      async (creditId: string) => {
        set(hrCreditsState, (credits) =>
          credits.filter((credit) => credit.id !== creditId),
        )
        refresh(notificationsSelector(["DispersedCredit", "AuthorizedCredit"]))
      },
  )

  return {
    removeCredit,
  }
}

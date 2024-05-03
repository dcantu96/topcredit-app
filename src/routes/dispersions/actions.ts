import { useRecoilCallback } from "recoil"

import { dispersionsState } from "./atoms"
import { notificationsSelector } from "components/organisms/activity-container/atoms"

export const useDispersionsActions = () => {
  const removeCredit = useRecoilCallback(
    ({ set, refresh }) =>
      async (creditId: string) => {
        set(dispersionsState, (credits) =>
          credits.filter((credit) => credit.id !== creditId),
        )
        refresh(notificationsSelector(["DispersedCredit", "AuthorizedCredit"]))
      },
  )

  return {
    removeCredit,
  }
}

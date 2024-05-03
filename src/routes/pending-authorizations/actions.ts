import { useRecoilCallback } from "recoil"

import { pendingAuthorizationsState } from "./atoms"
import { notificationsSelector } from "components/organisms/activity-container/atoms"

export const usePendingAuthorizationsActions = () => {
  const removeCredit = useRecoilCallback(
    ({ set, refresh }) =>
      async (creditId: string) => {
        set(pendingAuthorizationsState, (credits) =>
          credits.filter((credit) => credit.id !== creditId),
        )
        refresh(
          notificationsSelector([
            "PendingCredit",
            "AuthorizedCredit",
            "DeniedCredit",
            "InvalidDocumentationCredit",
          ]),
        )
      },
  )

  return {
    removeCredit,
  }
}

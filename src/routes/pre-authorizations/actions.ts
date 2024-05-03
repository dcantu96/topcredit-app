import { useRecoilCallback } from "recoil"

import { preAuthorizationUsersState } from "./atoms"
import { notificationsSelector } from "components/organisms/activity-container/atoms"

export const usePreAuthorizationActions = () => {
  const removeUser = useRecoilCallback(
    ({ set, snapshot, refresh }) =>
      async (userId: string) => {
        const currentUsers = await snapshot.getPromise(
          preAuthorizationUsersState,
        )
        set(
          preAuthorizationUsersState,
          currentUsers.filter((user) => user.id !== userId),
        )
        refresh(
          notificationsSelector([
            "PreAuthorizationUser",
            "PreAuthorizedUser",
            "DeniedUser",
          ]),
        )
      },
  )

  return {
    removeUser,
  }
}

import { useRecoilCallback } from "recoil"

import { preAuthorizationUsersState } from "./atoms"

export const usePreAuthorizationActions = () => {
  const removeUser = useRecoilCallback(
    ({ set, snapshot }) =>
      async (userId: string) => {
        const currentUsers = await snapshot.getPromise(
          preAuthorizationUsersState,
        )
        set(
          preAuthorizationUsersState,
          currentUsers.filter((user) => user.id !== userId),
        )
      },
  )

  return {
    removeUser,
  }
}

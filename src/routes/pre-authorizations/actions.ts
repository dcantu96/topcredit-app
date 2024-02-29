import { useRecoilCallback } from "recoil"

import { preAuthorizationUsersState } from "./atoms"

export const usePreAuthorizationActions = () => {
  const removeUser = useRecoilCallback(({ set }) => async (userId: string) => {
    set(preAuthorizationUsersState, (users) =>
      users.filter((user) => user.id !== userId),
    )
  })

  return {
    removeUser,
  }
}

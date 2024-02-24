import { atomFamily } from "recoil"

export type ListName = "pre-authorizations" | "requests"

export const listSortOrderState = atomFamily<
  "asc" | "desc" | undefined,
  ListName
>({
  key: "approvedUserSortOrderAtom",
  default: undefined,
})

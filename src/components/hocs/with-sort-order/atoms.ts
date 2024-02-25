import { atomFamily } from "recoil"

export type ListName = "pre-authorizations" | "requests" | "companies"

export const listSortOrderState = atomFamily<
  "asc" | "desc" | undefined,
  ListName
>({
  key: "approvedUserSortOrderAtom",
  default: undefined,
})

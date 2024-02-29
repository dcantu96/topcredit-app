import { atomFamily } from "recoil"

export type ListName =
  | "pre-authorizations"
  | "requests"
  | "companies"
  | "pending-authorizations"

export const listSortOrderState = atomFamily<
  "asc" | "desc" | undefined,
  ListName
>({
  key: "approvedUserSortOrderAtom",
  default: undefined,
})

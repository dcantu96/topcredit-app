import { atomFamily, selectorFamily } from "recoil"
import { companyCreditsDetailedWithPaymentsSelector } from "../../services/companies/atoms"

export const completedCreditSelectedState = atomFamily<boolean, string>({
  key: "completedCreditSelectedState",
  default: false,
})

export const selectedCompletedCreditsIdsState = selectorFamily<
  string[],
  string
>({
  key: "selectedCompletedCreditsIdsState",
  get:
    (companyId) =>
    ({ get }) => {
      const credits = get(companyCreditsDetailedWithPaymentsSelector(companyId))
      return (
        credits
          ?.filter((credit) => get(completedCreditSelectedState(credit.id)))
          .map((credit) => credit.id) ?? []
      )
    },
})

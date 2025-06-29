import { atomFamily, selectorFamily } from "recoil"
import { companyCreditsDetailedWithPaymentsSelector } from "../../services/companies/atoms"

export const installedCreditWithPaymentSelectedState = atomFamily<
  boolean,
  string
>({
  key: "installedWithPaymentCreditSelectedState",
  default: false,
})

export const selectedInstalledCreditWithPaymentsIdsState = selectorFamily<
  string[],
  string
>({
  key: "selectedInstalledCreditWithPaymentsIdsState",
  get:
    (companyId) =>
    ({ get }) => {
      const credits = get(companyCreditsDetailedWithPaymentsSelector(companyId))
      return (
        credits
          ?.filter((credit) =>
            get(installedCreditWithPaymentSelectedState(credit.id)),
          )
          .map((credit) => credit.id) ?? []
      )
    },
})

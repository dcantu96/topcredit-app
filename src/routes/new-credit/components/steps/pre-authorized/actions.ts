import { apiSelector } from "components/providers/api/atoms"
import { useRecoilCallback, useRecoilValue } from "recoil"
import { userLatestCreditSelectorQuery } from "../../../../new-credit/atoms"
import {
  creditAuthorizationState,
  creditContractState,
  creditPayrollReceiptState,
  readonlyCreditAuthorizationSelector,
  readonlyCreditContractSelector,
  readonlyCreditPayrollReceiptSelector,
} from "./atoms"

export const useSubmitCredit = () => {
  const credit = useRecoilValue(userLatestCreditSelectorQuery)
  const payrollReceipt = useRecoilValue(creditPayrollReceiptState)
  const contract = useRecoilValue(creditContractState)
  const authorization = useRecoilValue(creditAuthorizationState)

  const submit = useRecoilCallback(
    ({ snapshot, refresh, reset }) =>
      async (animate: () => void) => {
        const api = await snapshot.getPromise(apiSelector)
        try {
          await api.patch("credits", {
            id: credit?.id,
            authorization,
            contract,
            payrollReceipt,
            status: "pending",
            contractStatus: "pending",
            contractRejectionReason: null,
            authorizationStatus: "pending",
            authorizationRejectionReason: null,
            payrollReceiptStatus: "pending",
            payrollReceiptRejectionReason: null,
          })
          animate()
          refresh(userLatestCreditSelectorQuery)
          refresh(readonlyCreditPayrollReceiptSelector)
          refresh(readonlyCreditContractSelector)
          refresh(readonlyCreditAuthorizationSelector)
          reset(creditPayrollReceiptState)
          reset(creditContractState)
          reset(creditAuthorizationState)
        } catch (error) {
          console.error(error)
        }
      },
  )

  return {
    submit,
  }
}

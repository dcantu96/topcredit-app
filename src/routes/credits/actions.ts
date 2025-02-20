import { apiSelector } from "components/providers/api/atoms"
import useToast from "components/providers/toaster/useToast"
import { useRecoilCallback } from "recoil"
import { creditDetailedWithPaymentsState } from "./atoms"
import {
  companyCreditsDetailedWithPaymentsSelector,
  companyCreditsDetailedWithPaymentsState,
  companyCreditsWithPaymentsSelectorQuery,
  companyCreditsWithPaymentsState,
} from "../../services/companies/atoms"
import { Payment } from "../../schema.types"

type UpdatePaymentResponse = Pick<
  Payment,
  "id" | "amount" | "number" | "paidAt" | "expectedAt" | "expectedAmount"
>

const usePaymentActions = () => {
  const toast = useToast()

  const resetOnSuccess = useRecoilCallback(
    ({ reset, refresh, snapshot }) =>
      async (creditId: string) => {
        reset(companyCreditsWithPaymentsState)
        refresh(companyCreditsWithPaymentsSelectorQuery)

        const credit = await snapshot.getPromise(
          creditDetailedWithPaymentsState(creditId),
        )
        const companyId = credit.termOffering.company.id
        reset(companyCreditsDetailedWithPaymentsState(companyId))
        refresh(companyCreditsDetailedWithPaymentsSelector(companyId))
      },
  )

  const updatePayment = useRecoilCallback(
    ({ snapshot }) =>
      async (
        id: string,
        amount: number,
        creditId: string,
      ): Promise<UpdatePaymentResponse> => {
        const api = await snapshot.getPromise(apiSelector)
        const { data } = await api.update(`payments/${id}`, {
          id,
          amount,
        })
        toast.success({
          title: "Pago actualizado",
          message: "El pago ha sido actualizado exitosamente",
        })
        await resetOnSuccess(creditId)

        return {
          id: data.id.toString() as string,
          amount: data.amount as number,
          number: data.number as number,
          paidAt: data.paidAt as string,
          expectedAt: data.expectedAt as string,
          expectedAmount: data.expectedAmount as number,
        }
      },
  )

  const updatePaymentFromCredit = useRecoilCallback(
    ({ set }) =>
      (creditId: string, payment: UpdatePaymentResponse) => {
        set(creditDetailedWithPaymentsState(creditId), (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            payments: prev.payments.map((p) => {
              if (p.id === payment.id) {
                return {
                  ...p,
                  amount: payment.amount,
                  number: payment.number,
                  paidAt: payment.paidAt,
                  expectedAt: payment.expectedAt,
                  expectedAmount: payment.expectedAmount,
                }
              }
              return p
            }),
          }
        })
      },
  )

  return {
    updatePayment,
    updatePaymentFromCredit,
  }
}

export default usePaymentActions

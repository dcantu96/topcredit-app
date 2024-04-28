import { apiSelector } from "components/providers/api/atoms"
import useToast from "components/providers/toaster/useToast"
import { useRecoilCallback } from "recoil"
import { creditDetailedWithPaymentsState } from "./atoms"
import {
  companyCreditsDetailedWithPaymentsSelector,
  companyCreditsDetailedWithPaymentsState,
  companyCreditsWithPaymentsSelectorQuery,
  companyCreditsWithPaymentsState,
} from "../company-payments/atoms"

interface NewPaymentResponse {
  id: string
  amount: number
  number: number
  paidAt: string
}

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

  const registerPayment = useRecoilCallback(
    ({ snapshot }) =>
      async (
        creditId: string,
        amount: number,
        number: number,
      ): Promise<NewPaymentResponse> => {
        const api = await snapshot.getPromise(apiSelector)
        const { data } = await api.create(`payments`, {
          amount,
          number,
          paidAt: new Date().toISOString(),
          credit: {
            data: {
              id: creditId,
              type: "credits",
            },
          },
        })
        toast.success({
          title: "Pago registrado",
          message: "El pago ha sido registrado exitosamente",
        })
        await resetOnSuccess(creditId)

        return {
          id: data.id.toString() as string,
          amount: data.amount as number,
          number: data.number as number,
          paidAt: data.paidAt as string,
        }
      },
  )

  const addNewPaymentToCredit = useRecoilCallback(
    ({ set }) =>
      (creditId: string, payment: NewPaymentResponse) => {
        set(creditDetailedWithPaymentsState(creditId), (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            payments: [...prev.payments, payment],
          }
        })
      },
  )

  const deletePayment = useRecoilCallback(
    ({ snapshot, refresh }) =>
      async (paymentId: string, creditId: string) => {
        const api = await snapshot.getPromise(apiSelector)
        await api.delete(`payments`, paymentId)
        toast.success({
          title: "Pago eliminado",
          message: "El pago ha sido eliminado exitosamente",
        })
        refresh(companyCreditsWithPaymentsState)
        await resetOnSuccess(creditId)
      },
  )

  const deletePaymentFromCredit = useRecoilCallback(
    ({ set }) =>
      (creditId: string, paymentId: string) => {
        set(creditDetailedWithPaymentsState(creditId), (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            payments: prev.payments.filter(
              (payment) => payment.id !== paymentId,
            ),
          }
        })
      },
  )

  return {
    registerPayment,
    addNewPaymentToCredit,
    deletePayment,
    deletePaymentFromCredit,
  }
}

export default usePaymentActions

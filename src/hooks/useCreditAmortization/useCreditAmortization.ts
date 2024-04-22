import { useCallback, useMemo } from "react"
import { calculateAmortization, calculateTotalPaymentsInMonths } from "./utils"

import type { DurationType } from "src/schema.types"

interface CreditAmortizationProps {
  loan?: number
  duration?: number
  durationType?: DurationType
  rate?: number
}

const useCreditAmortization = ({
  loan,
  duration,
  durationType,
  rate,
}: CreditAmortizationProps) => {
  const amortization = useMemo(() => {
    if (!loan || !duration || !durationType || !rate) return undefined
    const totalPayments = calculateTotalPaymentsInMonths({
      duration,
      durationType,
    })
    return calculateAmortization({
      loanAmount: loan,
      totalPayments,
      rate,
    })
  }, [loan, duration, durationType, rate])

  return amortization
}

const useGetCreditAmortization = () => {
  const amortization = useCallback(
    ({ loan, duration, durationType, rate }: CreditAmortizationProps) => {
      if (!loan || !duration || !durationType || !rate) return undefined
      const totalPayments = calculateTotalPaymentsInMonths({
        duration,
        durationType,
      })
      return calculateAmortization({
        loanAmount: loan,
        totalPayments,
        rate,
      })
    },
    [],
  )

  return amortization
}

export { useGetCreditAmortization }

export default useCreditAmortization

import { useMemo } from "react"
import { calculateAmortization } from "./utils"
import { DurationType } from "src/schema.types"

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

    return calculateAmortization({
      loanAmount: loan,
      duration,
      durationType,
      rate,
    })
  }, [loan, duration, durationType, rate])

  return amortization
}

export default useCreditAmortization

import { Term } from "src/schema.types"

interface CalculateAmortizationProps {
  loanAmount: number
  duration: number
  durationType: Term["durationType"]
  rate: number
}

export function calculateAmortization({
  loanAmount,
  duration,
  durationType,
  rate,
}: CalculateAmortizationProps) {
  // payments should be monthly always, we need to calculate the total payment times
  const totalPayments =
    durationType === "years"
      ? duration * 12
      : durationType === "months"
        ? duration
        : durationType === "two-weeks"
          ? duration / 2
          : undefined

  if (!totalPayments) return undefined

  // Calculate total interest
  const monthlyInterestRate = rate / 12

  const monthlyPayment =
    (monthlyInterestRate * loanAmount) /
    (1 - Math.pow(1 + monthlyInterestRate, -totalPayments))

  return Number(monthlyPayment.toFixed(2))
}

import { Term } from "src/schema.types"

interface CalculateAmortizationProps {
  loanAmount: number
  totalPayments: number
  rate: number
}

interface CalculateTotalPaymentsInMonthsProps {
  duration: number
  durationType: Term["durationType"]
}

export function calculateTotalPaymentsInMonths({
  duration,
  durationType,
}: CalculateTotalPaymentsInMonthsProps) {
  switch (durationType) {
    case "years":
      return duration * 12
    case "months":
      return duration
    default:
      return duration / 2
  }
}

export function calculateMaxLoanAmount({
  borrowerMaxCapacity,
  totalPayments,
  annualRate,
}: {
  borrowerMaxCapacity: number
  totalPayments: number
  annualRate: number
}) {
  const monthlyRate = annualRate / 12 // Convert annual rate percentage to a monthly decimal

  // Rearranging the amortization formula to solve for principal P
  const maxLoanAmount =
    borrowerMaxCapacity *
    ((Math.pow(1 + monthlyRate, totalPayments) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)))

  return maxLoanAmount
}

export function calculateAmortization({
  loanAmount,
  totalPayments,
  rate,
}: CalculateAmortizationProps) {
  // Calculate total interest
  const monthlyInterestRate = rate / 12

  const monthlyPayment =
    (monthlyInterestRate * loanAmount) /
    (1 - Math.pow(1 + monthlyInterestRate, -totalPayments))

  return Number(monthlyPayment.toFixed(2))
}

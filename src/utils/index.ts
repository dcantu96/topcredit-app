interface CalculateAmortizationProps {
  loanAmount: number
  totalPayments: number
  rate: number
}

export function calculateMaxDebtCapacity({
  salary,
  companyMaxRateCapacity,
}: {
  salary: number
  companyMaxRateCapacity: number
}) {
  return Number((salary * companyMaxRateCapacity).toFixed(2))
}

export function calculateMaxLoanAmount({
  maxDebtCapacity,
  payments,
  rate,
}: {
  maxDebtCapacity: number
  payments: number
  rate: number
}) {
  return Number(((maxDebtCapacity * payments) / (1 + rate * 1.16)).toFixed(2))
}

export function calculateAmortization({
  loanAmount,
  totalPayments,
  rate,
}: CalculateAmortizationProps) {
  const creditAmount = loanAmount * (1 + rate * 1.16)

  return Number((creditAmount / totalPayments).toFixed(2))
}

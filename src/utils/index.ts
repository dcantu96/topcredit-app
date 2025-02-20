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

const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`

export const exportToCSV = (
  headers: string[],
  rows: string[][],
  fileName?: string,
) => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n")

  const encodedUri = encodeURI(csvContent)

  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", fileName || "export.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

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

export function firstExpectedPaymentDate(
  termDurationType: "bi-monthly" | "monthly",
): Date {
  const approvedAt = new Date() // Current time

  if (termDurationType === "bi-monthly") {
    if (approvedAt.getDate() < 4) {
      const fifteenth = new Date(
        approvedAt.getFullYear(),
        approvedAt.getMonth(),
        15,
        12,
      )
      return fifteenth
    } else if (approvedAt.getDate() < 20) {
      const endOfMonth = new Date(
        approvedAt.getFullYear(),
        approvedAt.getMonth() + 1,
        0,
        12,
      ) // Month is 0-indexed, day 0 gets the last day of the previous month
      return endOfMonth
    } else {
      const nextMonth = new Date(
        approvedAt.getFullYear(),
        approvedAt.getMonth() + 1,
        15,
        12,
      ) // 15th of next month
      return nextMonth
    }
  } else if (termDurationType === "monthly") {
    // Explicitly handle "monthly"
    if (approvedAt.getDate() < 20) {
      const endOfMonth = new Date(
        approvedAt.getFullYear(),
        approvedAt.getMonth() + 1,
        0,
        12,
      )
      return endOfMonth
    } else {
      const nextMonthEnd = new Date(
        approvedAt.getFullYear(),
        approvedAt.getMonth() + 2,
        0,
        12,
      ) // End of next month
      return nextMonthEnd
    }
  } else {
    throw new Error(
      "Invalid term duration type. Must be 'bi-monthly' or 'monthly'.",
    ) // Handle invalid input
  }
}

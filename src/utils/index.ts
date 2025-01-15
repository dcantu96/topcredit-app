import { expectedPaymentsByDate } from "../routes/company-installations/utils"

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

interface CalculatePaymentNumberProps {
  year: number
  month: number
  installationDateString: string
  termDuration: number
  twoWeekPeriod?: number
}

export const calculatePaymentNumber = ({
  year,
  month,
  installationDateString,
  termDuration,
  twoWeekPeriod,
}: CalculatePaymentNumberProps) => {
  // 1. Get the installation date

  // 2. Get the payment date using the month and the twoWeekPeriod.
  if (twoWeekPeriod) {
    if (twoWeekPeriod === 1) {
      // 2.1.1. If it's 1, it should be the first payment of the month at the 15th.
      return expectedPaymentsByDate(
        new Date(year, month - 1, 15, 6, 0, 0).toISOString(),
        "biweekly",
        installationDateString,
        termDuration,
      )
    } else if (twoWeekPeriod === 2) {
      // 2.1.2. If it's 2, it should be the second payment of the month at the last day of the month.
      return expectedPaymentsByDate(
        new Date(year, month, 0, 6, 0, 0).toISOString(),
        "biweekly",
        installationDateString,
        termDuration,
      )
    } else {
      throw new Error(
        "Invalid value for twoWeekPeriod. It should be either 1 or 2.",
      )
    }
  } else {
    // 2.2. If the twoWeekPeriod is not provided, it means its a monthly payment and should be at the last day of the month.
    return expectedPaymentsByDate(
      new Date(year, month, 0, 6, 0, 0).toISOString(),
      "monthly",
      installationDateString,
      termDuration,
    )
  }
}

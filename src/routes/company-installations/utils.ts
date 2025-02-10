import dayjs from "dayjs"
import type { Credit, CreditStatus, Payment } from "src/schema.types"

// Helper function to find the last day of a given month
function getLastDayOfMonth(year: number, month: number) {
  return new Date(year, month + 1, 0, 6, 0, 0).getDate()
}

export function fetchNextPayrollDate(
  durationType: "biweekly" | "monthly",
  date?: string,
) {
  const currentDate = date ? new Date(date) : new Date()
  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  // for monthly payrolls, the next payroll date should always be the last day of the month
  if (durationType === "monthly") {
    // get the last day of the current month
    return new Date(currentYear, currentMonth + 1, 0, 6, 0, 0)
  } else {
    // for biweekly payrolls, the next payroll date should be either the 15th or the last day of the month
    // if the current day is greater than 15 then the next payroll date should be the last day of the month
    if (currentDay > 15) {
      return new Date(currentYear, currentMonth + 1, 0, 6, 0, 0)
    } else {
      // return the 15th of the current month
      return new Date(currentYear, currentMonth, 15, 6, 0, 0)
    }
  }
}

export function fetchLastPayrollDate(durationType: "biweekly" | "monthly") {
  const currentDate = dayjs()
  // for monthly payrolls, the last payroll date should always be the last day of the last month
  if (durationType === "monthly") {
    // get the last day of the last month
    return currentDate.subtract(1, "month").endOf("month").locale()
  } else {
    // for biweekly payrolls, the last payroll date should be either the 15th or the last day of the month
    // if the current day is greater than 15 then the last payroll date is the 15th of the current month
    if (currentDate.date() > 15) {
      return currentDate.set("day", 15).endOf("day").toDate()
    } else {
      // return the last day of the last month
      return currentDate.subtract(1, "month").endOf("month").toDate()
    }
  }
}

export function expectedInstallationDate(
  dispersedAt: string,
  durationType: "biweekly" | "monthly",
) {
  const date = new Date(dispersedAt)
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  if (durationType === "monthly") {
    // get the last day of the current month
    return new Date(year, month + 1, 0, 6, 0, 0)
  } else {
    if (day >= 21) {
      // Due date is the 15th of the next month
      return new Date(year, month + 1, 15, 6, 0, 0)
    } else if (day >= 6) {
      // Due date is the last day of the current month
      const lastDay = getLastDayOfMonth(year, month)
      return new Date(year, month, lastDay, 6, 0, 0)
    } else {
      // If today is between 1st and 5th (inclusive), the due date is the 15th of the current month
      return new Date(year, month, 15, 6, 0, 0)
    }
  }
}

export function getNextPaymentDate(
  lastPaymentDate: Date,
  frequency: "biweekly" | "monthly",
) {
  // Advance the date by either 14 days for biweekly or to the end of the next month for monthly
  if (frequency === "biweekly") {
    const lastPaymentDay = lastPaymentDate.getDate()
    const lastPaymentMonth = lastPaymentDate.getMonth()
    const lastPaymentYear = lastPaymentDate.getFullYear()
    // for biweekly payrolls, the next payroll date should be either the 15th or the last day of the month
    // if the current day is greater than 15 then the next payroll date should be the last day of the month
    if (lastPaymentDay > 15) {
      // return the next month's 15th
      return new Date(lastPaymentYear, lastPaymentMonth + 1, 15, 6, 0, 0)
    } else {
      // return the last day of the current month
      return new Date(lastPaymentYear, lastPaymentMonth + 1, 0, 6, 0, 0)
    }
  } else {
    // Calculate the end of the next month for monthly payment frequency
    const year = lastPaymentDate.getFullYear()
    const month = lastPaymentDate.getMonth() + 2 // Move to the next month and find its end
    const nextMonthEnd = new Date(year, month, 0, 6, 0, 0) // Set day to 0 to get the last day of the previous month
    return nextMonthEnd
  }
}

export const installationStatusIs =
  (status: "installed" | null) =>
  (credit: Pick<Credit, "id" | "status" | "installationStatus">) =>
    credit.installationStatus === status

export const creditStatusIs =
  (status: CreditStatus) =>
  (credit: Pick<Credit, "id" | "status" | "installationStatus">) =>
    credit.status === status

export const hasDelayedInstallation = (
  credit: Pick<
    Credit,
    "id" | "loan" | "dispersedAt" | "installationStatus" | "installationDate"
  >,
  employeeSalaryFrequency: "biweekly" | "monthly",
) => {
  return (
    expectedInstallationDate(credit.dispersedAt!, employeeSalaryFrequency) <
    new Date()
  )
}

export const hasDelayedPayment = (
  credit: Pick<
    Credit,
    "id" | "loan" | "dispersedAt" | "installationStatus" | "installationDate"
  > & {
    payments: Pick<Payment, "id" | "paidAt" | "amount">[]
  },
  employeeSalaryFrequency: "biweekly" | "monthly",
  termDuration: number,
) => {
  const dateOfPastPayment = credit.payments?.at(-1)?.paidAt
  if (!dateOfPastPayment || !credit.payments) {
    const expectedFirstPaymentDate = fetchNextPayrollDate(
      employeeSalaryFrequency,
      credit.installationDate!,
    )
    return expectedFirstPaymentDate < new Date()
  }

  const expectedPaymentsToDate = expectedPaymentsByDate(
    new Date().toISOString(),
    employeeSalaryFrequency,
    credit.installationDate!,
    termDuration,
  )

  if (credit.payments.length < expectedPaymentsToDate) {
    return true
  }
  // check when the expected next payment date is
  const nextPaymentDate = getNextPaymentDate(
    new Date(dateOfPastPayment),
    employeeSalaryFrequency,
  )

  return nextPaymentDate < new Date()
}

export const expectedPaymentsByDate = (
  date: string,
  employeeSalaryFrequency: "biweekly" | "monthly",
  fromDate: string,
  termDuration: number,
) => {
  const toDateRaw = new Date(date)
  const toDate = new Date(
    toDateRaw.getFullYear(),
    toDateRaw.getMonth(),
    toDateRaw.getDate(),
    6,
    0,
    0,
  )
  let numberOfPayments = 0
  const currentDateRaw = new Date(fromDate)
  let currentDate = new Date(
    currentDateRaw.getFullYear(),
    currentDateRaw.getMonth(),
    currentDateRaw.getDate(),
    6,
    0,
    0,
  )

  while (currentDate <= toDate && numberOfPayments < termDuration) {
    numberOfPayments++ // Assume each cycle we're checking represents a due payment period
    const nextDate = getNextPaymentDate(currentDate, employeeSalaryFrequency)

    // Advance the current date to the next calculated payment date
    if (nextDate > toDate || numberOfPayments >= termDuration) {
      break // Exit if the next payment date exceeds the range or term duration limit is reached
    }

    currentDate = new Date(nextDate) // This avoids mutating currentDate in parts
  }

  return numberOfPayments
}

export const installationOnTime = (
  credit: Pick<
    Credit,
    "id" | "loan" | "dispersedAt" | "installationStatus" | "installationDate"
  >,
  employeeSalaryFrequency: "biweekly" | "monthly",
) => {
  return (
    expectedInstallationDate(credit.dispersedAt!, employeeSalaryFrequency) >=
    new Date()
  )
}

interface PaymentOnTimeProps {
  paymentNumber: number
  employeeSalaryFrequency: "biweekly" | "monthly"
  installationDate: string
  paidAt?: string
}

export const paymentOnTime = ({
  paymentNumber,
  employeeSalaryFrequency,
  installationDate,
  paidAt,
}: PaymentOnTimeProps) => {
  // initialize the expectedPaymentDate with the expectedInstallationPaymentDate
  let expectedPaymentDate = fetchNextPayrollDate(
    employeeSalaryFrequency,
    installationDate,
  )
  // now using the expectedInstallationPaymentDate as the starting point, calculate the expected payment date for the given payment number
  // first we need to calculate the expected payment date for the payment number so we use the expectedInstallationPaymentDate
  for (let i = 1; i < paymentNumber; i++) {
    expectedPaymentDate = getNextPaymentDate(
      expectedPaymentDate,
      employeeSalaryFrequency,
    )
  }

  if (paidAt) {
    return {
      onTime: new Date(paidAt) <= expectedPaymentDate,
      expectedPaymentDate,
    }
  } else {
    return {
      onTime: new Date() <= expectedPaymentDate,
      expectedPaymentDate,
    }
  }
}

export const amortizedTable = (
  termDuration: number,
  termFrequency: "biweekly" | "monthly",
  amortization: number,
  installationDate: string,
) => {
  const table = []
  let currentDate = new Date(installationDate)
  for (let i = 0; i < termDuration; i++) {
    const nextPaymentDate = getNextPaymentDate(currentDate, termFrequency)

    table.push({
      number: i + 1,
      expected: amortization,
      dueDate: nextPaymentDate.toISOString().slice(0, 10),
    })
    currentDate = nextPaymentDate
  }
  return table
}

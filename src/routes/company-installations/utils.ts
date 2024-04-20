import type { Credit, CreditStatus } from "src/schema.types"

// Helper function to find the last day of a given month
function getLastDayOfMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export function fetchNextInstallationDueDate() {
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  if (currentDay >= 21) {
    // Due date is the 15th of the next month
    return new Date(currentYear, currentMonth + 1, 15)
  } else if (currentDay >= 6) {
    // Due date is the last day of the current month
    const lastDay = getLastDayOfMonth(currentYear, currentMonth)
    return new Date(currentYear, currentMonth, lastDay)
  } else {
    // If today is between 1st and 5th (inclusive), the due date is the 15th of the current month
    return new Date(currentYear, currentMonth, 15)
  }
}

export function expectedInstallationDate(dispersedAt: string) {
  const date = new Date(dispersedAt)
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  if (day >= 21) {
    // Due date is the 15th of the next month
    return new Date(year, month + 1, 15)
  } else if (day >= 6) {
    // Due date is the last day of the current month
    const lastDay = getLastDayOfMonth(year, month)
    return new Date(year, month, lastDay)
  } else {
    // If today is between 1st and 5th (inclusive), the due date is the 15th of the current month
    return new Date(year, month, 15)
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
) => {
  return expectedInstallationDate(credit.dispersedAt!) < new Date()
}

export const installationOnTime = (
  credit: Pick<
    Credit,
    "id" | "loan" | "dispersedAt" | "installationStatus" | "installationDate"
  >,
) => {
  return expectedInstallationDate(credit.dispersedAt!) >= new Date()
}

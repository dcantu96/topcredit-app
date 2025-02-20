import { Credit } from "../../../schema.types"

export const mockInstalledCredits: Pick<
  Credit,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "amortization"
  | "creditAmount"
  | "status"
  | "loan"
  | "payments"
  | "termOffering"
  | "hrStatus"
>[] = []

// Helper function to generate random dates within the last 6 months
const getRandomDate = () => {
  const today = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(today.getMonth() - 6)

  const randomTime =
    sixMonthsAgo.getTime() +
    Math.random() * (today.getTime() - sixMonthsAgo.getTime())
  return new Date(randomTime).toISOString()
}

// Helper function to generate random amounts within a range
const getRandomAmount = (min: number, max: number) => {
  return (Math.random() * (max - min) + min).toFixed(2) // Keep 2 decimal places
}

const creditStatuses = [
  "new",
  "pending",
  "invalid-documentation",
  "authorized",
  "denied",
  "dispersed",
] as const

for (let i = 0; i < 100; i++) {
  const initial = getRandomDate()
  mockInstalledCredits.push({
    id: i.toString(), // Or use a UUID library for better uniqueness
    createdAt: initial,
    updatedAt: initial,
    amortization: `${Number(getRandomAmount(1000, 10000))}`,
    creditAmount: `${Number(getRandomAmount(5000, 50000))}`,
    status: creditStatuses[Math.floor(Math.random() * creditStatuses.length)],
    loan: Math.floor(Math.random() * 100000), // Random loan amount
    payments: [], // Initialize as empty array, or add mock payments if needed
    termOffering: null, // Add mock termOffering data if needed
    hrStatus: "approved",
  })
}

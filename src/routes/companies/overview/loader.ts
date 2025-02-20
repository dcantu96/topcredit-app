import { selectorFamily } from "recoil"
import {
  Credit,
  Payment,
  User,
  TermOffering,
  Term,
} from "../../../schema.types" // Import all your types
import { apiSelector } from "components/providers/api/atoms"

// Define the API response types with nested data structure
interface CompanyInstalledCreditsResponse {
  data: CompanyInstalledCreditResponseItem[]
}

interface CompanyInstalledCreditResponseItem {
  id: Credit["id"]
  updatedAt: Credit["updatedAt"]
  createdAt: Credit["createdAt"]
  amortization: Credit["amortization"]
  creditAmount: Credit["creditAmount"]
  status: Credit["status"]
  loan: Credit["loan"]
  dispersedAt: Credit["dispersedAt"]
  firstDiscountDate: Credit["firstDiscountDate"]
  payments: {
    data: Pick<
      Payment,
      | "id"
      | "createdAt"
      | "amount"
      | "number"
      | "paidAt"
      | "expectedAt"
      | "expectedAmount"
    >[]
  } | null
  borrower: {
    data: Pick<User, "id" | "firstName" | "lastName" | "email">
  } | null
  termOffering: {
    data: {
      id: TermOffering["id"]
      term: { data: Pick<Term, "id" | "name" | "durationType" | "duration"> }
    } | null
  } | null // Nested term!
}

type CompanyInstalledCredit = Pick<
  Credit,
  | "id"
  | "updatedAt"
  | "createdAt"
  | "amortization"
  | "creditAmount"
  | "status"
  | "loan"
  | "dispersedAt"
  | "firstDiscountDate"
> & {
  payments: Pick<
    Payment,
    | "id"
    | "createdAt"
    | "amount"
    | "number"
    | "paidAt"
    | "expectedAt"
    | "expectedAmount"
  >[]
  borrower: Pick<User, "id" | "firstName" | "lastName" | "email"> | null
  termOffering:
    | (Pick<TermOffering, "id"> & {
        term: Pick<Term, "id" | "name" | "durationType" | "duration">
      })
    | null
}

export const companyInstalledCreditsQuery = selectorFamily<
  CompanyInstalledCredit[],
  string
>({
  key: "companyInstalledCreditsQuery",
  get:
    (companyId) =>
    async ({ get }) => {
      const api = get(apiSelector)

      try {
        const resp: { data: CompanyInstalledCreditsResponse } = await api.get(
          `company/${companyId}/credits`,
          {
            params: {
              fields: {
                payments:
                  "id,createdAt,amount,number,paidAt,expectedAt,expectedAmount",
                termOfferings: "id,term",
                terms: "id,name,durationType,duration",
                users: "id,firstName,lastName,email",
                credits:
                  "id,updatedAt,createdAt,amortization,creditAmount,status,loan,borrower,termOffering,payments,firstDiscountDate,dispersedAt",
              },
              include: "borrower,termOffering.term,payments",
              filter: {
                status: "dispersed",
              },
            },
          },
        )

        if (!resp.data || !resp.data || !Array.isArray(resp.data)) {
          console.error("Invalid data received from API:", resp.data)
          return []
        }

        return resp.data.map((creditData) => ({
          ...creditData,
          payments: creditData.payments?.data ?? [],
          borrower: creditData.borrower?.data ?? null,
          termOffering: creditData.termOffering?.data
            ? {
                id: creditData.termOffering.data.id,
                term: creditData.termOffering.data.term.data,
              }
            : null,
        }))
      } catch (error) {
        console.error("Error fetching credits:", error)
        return []
      }
    },
})

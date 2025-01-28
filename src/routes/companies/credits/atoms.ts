import { selectorFamily } from "recoil"

import { apiSelector } from "components/providers/api/atoms"

import type { Credit, Term } from "src/schema.types"
import { myProfileState } from "components/providers/auth/atoms"

export type CompanyCreditsResponse = Pick<
  Credit,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "loan"
  | "amortization"
  | "hrStatus"
> & {
  borrower: {
    data: Credit["borrower"]
  }
  termOffering: {
    data: Credit["termOffering"] & {
      term: {
        data: Term
      }
    }
  }
  payments: {
    data: Credit["payments"]
  }
}

export const companyCreditsSelectorQuery = selectorFamily<
  Map<
    string,
    Pick<
      Credit,
      | "id"
      | "status"
      | "updatedAt"
      | "createdAt"
      | "loan"
      | "termOffering"
      | "borrower"
      | "amortization"
      | "hrStatus"
      | "payments"
    >
  >,
  string
>({
  key: "companyCreditsSelectorQuery",
  get:
    (companyId) =>
    async ({ get }) => {
      const user = get(myProfileState)
      const api = get(apiSelector)

      if (!user?.roles.includes("admin") && !user?.roles.length) {
        throw new Error("Usuario no autorizado")
      }

      const filter: Record<string, string | number | null> = {
        company: companyId,
      }

      const { data }: { data: CompanyCreditsResponse[] } = await api.get(
        "credit",
        {
          params: {
            fields: {
              credits:
                "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,payments",
            },
            include: "borrower,termOffering.term,payments",
            filter,
          },
        },
      )

      const map = new Map<
        string,
        Pick<
          Credit,
          | "id"
          | "status"
          | "updatedAt"
          | "createdAt"
          | "loan"
          | "termOffering"
          | "borrower"
          | "amortization"
          | "hrStatus"
          | "payments"
        >
      >()
      for (const credit of data) {
        map.set(credit.id, {
          ...credit,
          borrower: credit.borrower.data,
          termOffering: {
            ...(credit.termOffering.data || {}),
            term: credit.termOffering.data?.term.data,
          },
          payments: credit.payments.data || [],
        })
      }
      return map
    },
})

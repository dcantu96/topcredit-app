import { atomFamily, selectorFamily } from "recoil"

import { apiSelector } from "components/providers/api/atoms"

import type { Credit, Term } from "src/schema.types"

export type HRCreditViewMode = "pending" | "approved" | "denied" | "all"

export type HRCreditsResponse = Pick<
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

export type ActiveCredit = Pick<
  Credit,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "termOffering"
  | "borrower"
  | "hrStatus"
> & {
  payments: NonNullable<Credit["payments"]>
  amortization: NonNullable<Credit["amortization"]>
  loan: NonNullable<Credit["loan"]>
}

export type ActiveCreditsMap = Map<string, ActiveCredit>

export const activeCreditsSelectorQuery = selectorFamily<
  ActiveCreditsMap,
  string
>({
  key: "activeCreditsSelectorQuery",
  get:
    (companyId) =>
    async ({ get }) => {
      const api = get(apiSelector)

      const { data }: { data: HRCreditsResponse[] } = await api.get("credit", {
        params: {
          fields: {
            credits:
              "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,payments",
          },
          include: "borrower,termOffering.term,payments",
          filter: {
            status: "dispersed",
            company: companyId,
          },
        },
      })

      const map = new Map<string, ActiveCredit>()
      for (const credit of data) {
        const payments = credit.payments.data
        const amortization = credit.amortization
        const loan = credit.loan
        if (!payments) {
          throw new Error("Payments should not be null")
        }
        if (!amortization) {
          throw new Error("Amortization should not be null")
        }
        if (!loan) {
          throw new Error("Loan should not be null")
        }
        map.set(credit.id, {
          ...credit,
          loan,
          amortization,
          borrower: credit.borrower.data,
          termOffering: {
            ...(credit.termOffering.data || {}),
            term: credit.termOffering.data?.term.data,
          },
          payments: payments.toSorted((a, b) => a.number - b.number),
        })
      }
      return map
    },
})

export type HRRequestsCreditsResponse = Pick<
  Credit,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "loan"
  | "amortization"
  | "hrStatus"
  | "firstDiscountDate"
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
}

export type HRRequestCredit = Pick<
  Credit,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "termOffering"
  | "borrower"
  | "hrStatus"
  | "firstDiscountDate"
> & {
  amortization: NonNullable<Credit["amortization"]>
  loan: NonNullable<Credit["loan"]>
}

export type HRRequestCreditMap = Map<string, HRRequestCredit>

export const hrRequestCreditsSelectorQuery = selectorFamily<
  HRRequestCreditMap,
  string
>({
  key: "hrRequestCreditsSelectorQuery",
  get:
    (companyId) =>
    async ({ get }) => {
      const api = get(apiSelector)

      const { data }: { data: HRRequestsCreditsResponse[] } = await api.get(
        "credit",
        {
          params: {
            fields: {
              credits:
                "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,firstDiscountDate",
            },
            include: "borrower,termOffering.term",
            filter: {
              status: "authorized",
              company: companyId,
            },
          },
        },
      )

      const map = new Map<string, HRRequestCredit>()
      for (const credit of data) {
        const amortization = credit.amortization
        const loan = credit.loan
        if (!amortization) {
          throw new Error("Amortization should not be null")
        }
        if (!loan) {
          throw new Error("Loan should not be null")
        }
        map.set(credit.id, {
          ...credit,
          loan,
          amortization,
          borrower: credit.borrower.data,
          firstDiscountDate: credit.firstDiscountDate,
          termOffering: {
            ...(credit.termOffering.data || {}),
            term: credit.termOffering.data?.term.data,
          },
        })
      }
      return map
    },
})

export const hrCreditSelectorQuery = selectorFamily<
  | Pick<
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
    >
  | undefined,
  string
>({
  key: "hrCreditSelectorQuery",
  get:
    (creditId) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: HRCreditsResponse } = await api.get(
        `credits/${creditId}`,
        {
          params: {
            fields: {
              credits:
                "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,payments",
            },
            include: "borrower,termOffering.term,payments",
          },
        },
      )

      return {
        ...data,
        borrower: data.borrower.data,
        termOffering: {
          ...(data.termOffering.data || {}),
          term: data.termOffering.data?.term.data,
        },
        payments: data.payments.data || [],
      }
    },
})

export const editableDispersionReceiptFieldState = atomFamily<
  string | null,
  string
>({
  key: "editableDispersionReceiptFieldState",
  default: null,
})

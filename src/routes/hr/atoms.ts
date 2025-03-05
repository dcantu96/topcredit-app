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
  firstDiscountDate: NonNullable<Credit["firstDiscountDate"]>
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
              "id,status,updatedAt,createdAt,loan,borrower,termOffering,amortization,hrStatus,payments,firstDiscountDate",
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
        const firstDiscountDate = credit.firstDiscountDate
        if (!payments) {
          throw new Error("Payments should not be null")
        }
        if (!amortization) {
          throw new Error("Amortization should not be null")
        }
        if (!loan) {
          throw new Error("Loan should not be null")
        }
        if (!firstDiscountDate) {
          throw new Error("First discount date should not be null")
        }

        map.set(credit.id, {
          ...credit,
          loan,
          amortization,
          firstDiscountDate,
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

export const creditPressed = atomFamily<boolean, string>({
  key: "creditPressed",
  default: false,
})

export const creditSelectionState = selectorFamily({
  key: "creditSelectionState",
  get:
    (companyId: string) =>
    ({ get }) => {
      const credits = get(activeCreditsSelectorQuery(companyId))
      const ids = Array.from(credits.keys())

      const selectedCredits = ids.filter((id) => get(creditPressed(id)))
      const selectedCount = selectedCredits.length
      const totalCount = ids.length

      if (selectedCount === 0) {
        return "none"
      } else if (selectedCount === totalCount) {
        return "fully"
      } else {
        return "partial"
      }
    },
})

export const totalToCollectState = selectorFamily({
  key: "totalToCollectState",
  get:
    (companyId: string) =>
    ({ get }) => {
      const credits = get(activeCreditsSelectorQuery(companyId))
      const ids = Array.from(credits.keys())

      const selectedCredits = ids.filter((id) => get(creditPressed(id)))

      let total = 0

      for (const id of selectedCredits) {
        const paymentNumbers = new Set<number>()
        const credit = credits.get(id)
        if (!credit) continue
        for (const payment of credit.payments) {
          // if payment is not paid and delayed add it to the set
          if (
            !payment.paidAt &&
            !!payment.expectedAt &&
            new Date(payment.expectedAt) < new Date()
          ) {
            paymentNumbers.add(payment.number)
          }
        }
        // add next payment to the set
        const nextPayment = credit.payments
          .toSorted((a, b) => a.number - b.number)
          .find((payment) => !payment.paidAt)
        if (nextPayment) {
          paymentNumbers.add(nextPayment.number)
        }

        // add the amount of payments
        total += paymentNumbers.size * Number(credit.amortization)
      }

      return total
    },
})

export const selectedCreditsSelector = selectorFamily({
  key: "selectedCreditsSelector",
  get:
    (companyId: string) =>
    ({ get }) => {
      const credits = get(activeCreditsSelectorQuery(companyId))
      const ids = Array.from(credits.keys())
      const selectedIds = ids.filter((id) => get(creditPressed(id)))
      return selectedIds.map((id) => credits.get(id)!)
    },
})

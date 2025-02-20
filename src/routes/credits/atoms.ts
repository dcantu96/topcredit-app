import { atomFamily, selectorFamily } from "recoil"

import { apiSelector } from "components/providers/api/atoms"

import type {
  Company,
  Credit,
  Payment,
  Term,
  TermOffering,
} from "src/schema.types"

export type CreditDetailedResponse = Pick<
  Credit,
  | "amortization"
  | "creditAmount"
  | "dispersedAt"
  | "hrStatus"
  | "id"
  | "firstDiscountDate"
  | "loan"
  | "maxLoanAmount"
  | "status"
  | "createdAt"
  | "payrollReceiptUrl"
  | "payrollReceiptContentType"
  | "payrollReceiptFilename"
  | "payrollReceiptSize"
  | "payrollReceiptUploadedAt"
  | "contractUrl"
  | "contractContentType"
  | "contractFilename"
  | "contractSize"
  | "contractUploadedAt"
  | "authorizationUrl"
  | "authorizationContentType"
  | "authorizationFilename"
  | "authorizationSize"
  | "authorizationUploadedAt"
> & {
  borrower: {
    data: Pick<
      Credit["borrower"],
      | "id"
      | "firstName"
      | "lastName"
      | "email"
      | "bankAccountNumber"
      | "employeeNumber"
      | "salary"
    >
  }
  payments: {
    data:
      | Pick<
          Payment,
          | "id"
          | "paidAt"
          | "amount"
          | "number"
          | "expectedAt"
          | "expectedAmount"
        >[]
      | null
  }
  termOffering: {
    data: Pick<TermOffering, "id"> & {
      term: {
        data: Pick<Term, "id" | "durationType" | "duration">
      }
      company: {
        data: Pick<Company, "rate" | "employeeSalaryFrequency" | "name" | "id">
      }
    }
  }
}

export type CreditDetailed = Pick<
  Credit,
  | "amortization"
  | "creditAmount"
  | "dispersedAt"
  | "hrStatus"
  | "id"
  | "firstDiscountDate"
  | "loan"
  | "maxLoanAmount"
  | "status"
  | "createdAt"
  | "payrollReceiptUrl"
  | "payrollReceiptContentType"
  | "payrollReceiptFilename"
  | "payrollReceiptSize"
  | "payrollReceiptUploadedAt"
  | "contractUrl"
  | "contractContentType"
  | "contractFilename"
  | "contractSize"
  | "contractUploadedAt"
  | "authorizationUrl"
  | "authorizationContentType"
  | "authorizationFilename"
  | "authorizationSize"
  | "authorizationUploadedAt"
> & {
  borrower: Pick<
    Credit["borrower"],
    | "id"
    | "firstName"
    | "lastName"
    | "email"
    | "bankAccountNumber"
    | "employeeNumber"
    | "salary"
  >
  payments: Pick<
    Payment,
    "id" | "paidAt" | "amount" | "number" | "expectedAt" | "expectedAmount"
  >[]
  termOffering: Pick<TermOffering, "id"> & {
    term: Pick<Term, "id" | "durationType" | "duration">
    company: Pick<Company, "rate" | "employeeSalaryFrequency" | "name" | "id">
  }
}

export const creditDetailedWithPaymentsSelector = selectorFamily<
  CreditDetailed,
  string
>({
  key: "creditDetailedWithPaymentsSelector",
  get:
    (id) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: CreditDetailedResponse } = await api.get(
        "credits/" + id,
        {
          params: {
            fields: {
              terms: "id,durationType,duration",
              companies: "rate,employeeSalaryFrequency,name,id",
              termOfferings: "id,term,company",
              users:
                "id,firstName,lastName,email,bankAccountNumber,employeeNumber,salary",
              credits:
                "createdAt,amortization,borrower,creditAmount,dispersedAt,hrStatus,id,firstDiscountDate,loan,maxLoanAmount,payments,termOffering,status,payrollReceiptUrl,payrollReceiptContentType,payrollReceiptFilename,payrollReceiptSize,payrollReceiptUploadedAt,contractUrl,contractContentType,contractFilename,contractSize,contractUploadedAt,authorizationUrl,authorizationContentType,authorizationFilename,authorizationSize,authorizationUploadedAt",
            },
            include:
              "borrower,payments,termOffering,termOffering.term,termOffering.company",
          },
        },
      )

      return {
        ...data,
        borrower: data.borrower.data,
        termOffering: {
          ...data.termOffering.data,
          term: data.termOffering.data.term.data,
          company: data.termOffering.data.company.data,
        },
        payments:
          data.payments.data?.toSorted((a, b) => a.number - b.number) || [],
      }
    },
})

export const creditDetailedWithPaymentsState = atomFamily({
  key: "creditDetailedWithPaymentsState",
  default: creditDetailedWithPaymentsSelector,
})

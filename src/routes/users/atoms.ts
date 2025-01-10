import { selectorFamily } from "recoil"
import { apiSelector } from "components/providers/api/atoms"
import { Credit, User } from "src/schema.types"

export type UserResponse = Pick<
  User,
  | "id"
  | "status"
  | "updatedAt"
  | "createdAt"
  | "addressLineOne"
  | "addressLineTwo"
  | "city"
  | "state"
  | "postalCode"
  | "country"
  | "email"
  | "firstName"
  | "lastName"
  | "phone"
  | "bankAccountNumber"
  | "rfc"
  | "salary"
  | "reason"
  | "employeeNumber"
  | "bankStatementFilename"
  | "bankStatementContentType"
  | "bankStatementSize"
  | "bankStatementStatus"
  | "bankStatementUploadedAt"
  | "bankStatementUrl"
  | "identityDocumentFilename"
  | "identityDocumentContentType"
  | "identityDocumentSize"
  | "identityDocumentStatus"
  | "identityDocumentUploadedAt"
  | "identityDocumentUrl"
  | "payrollReceiptFilename"
  | "payrollReceiptContentType"
  | "payrollReceiptSize"
  | "payrollReceiptStatus"
  | "payrollReceiptUploadedAt"
  | "payrollReceiptUrl"
  | "proofOfAddressFilename"
  | "proofOfAddressContentType"
  | "proofOfAddressSize"
  | "proofOfAddressStatus"
  | "proofOfAddressUploadedAt"
  | "proofOfAddressUrl"
> & {
  credits: {
    data: Credit[]
  }
}

export const userSelector = selectorFamily({
  key: "userSelector",
  get:
    (id: string) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: UserResponse } = await api.get("users/" + id, {
        params: {
          fields: {
            credits: "id,status,loan",
            users:
              "credits,id,status,firstName,lastName,email,createdAt,updatedAt,addressLineOne,addressLineTwo,city,state,postalCode,country,phone,bankAccountNumber,rfc,salary,reason,employeeNumber,bankStatementFilename,bankStatementContentType,bankStatementSize,bankStatementStatus,bankStatementUploadedAt,bankStatementUrl,identityDocumentFilename,identityDocumentContentType,identityDocumentSize,identityDocumentStatus,identityDocumentUploadedAt,identityDocumentUrl,payrollReceiptFilename,payrollReceiptContentType,payrollReceiptSize,payrollReceiptStatus,payrollReceiptUploadedAt,payrollReceiptUrl,proofOfAddressFilename,proofOfAddressContentType,proofOfAddressSize,proofOfAddressStatus,proofOfAddressUploadedAt,proofOfAddressUrl",
          },
          include: "credits",
        },
      })

      const { credits, ...user } = data

      return {
        ...user,
        credits: credits.data,
      }
    },
})

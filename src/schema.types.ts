export type Role =
  | "admin"
  | "requests"
  | "companies"
  | "pre_authorizations"
  | "authorizations"
  | "dispersions"

export type UserStatus =
  | "new"
  | "pending"
  | "invalid-documentation"
  | "pre-authorization"
  | "pre-authorized"
  | "denied"

export type CreditStatus =
  | "new"
  | "pending"
  | "invalid-documentation"
  | "authorized"
  | "denied"
  | "dispersed"

export type DurationType = "years" | "months" | "two-weeks"

export interface TokenResponse {
  access_token: string
  created_at: number
  expires_in: number
  token_type: string
}

export interface MeResponse {
  email: string
  id: number
  firstName: string | null
  lastName: string | null
  roles: Role[]
}

export interface ObjectWithId {
  id: string
}

export interface Timestamps {
  createdAt: string
  updatedAt: string
}

export interface User extends ObjectWithId, Timestamps {
  addressLineOne: string | null
  addressLineTwo: string | null
  bankAccountNumber: string | null
  city: string | null
  country: string | null
  email: string
  employeeNumber: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
  postalCode: string | null
  rfc: string | null
  salary: number | null
  salaryFrequency: string | null
  state: string | null
  status: UserStatus | null
  identityDocumentUrl: string | null
  identityDocumentContentType: string | null
  identityDocumentFilename: string | null
  identityDocumentSize: string | null
  identityDocumentUploadedAt: string | null
  payrollReceiptUrl: string | null
  payrollReceiptContentType: string | null
  payrollReceiptFilename: string | null
  payrollReceiptSize: string | null
  payrollReceiptUploadedAt: string | null
  proofOfAddressUrl: string | null
  proofOfAddressContentType: string | null
  proofOfAddressFilename: string | null
  proofOfAddressSize: string | null
  proofOfAddressUploadedAt: string | null
  bankStatementUrl: string | null
  bankStatementContentType: string | null
  bankStatementFilename: string | null
  bankStatementSize: string | null
  bankStatementUploadedAt: string | null
  reason: string | null
}

export interface Credit extends ObjectWithId, Timestamps {
  loan: number | null
  status: CreditStatus
  borrower: User
  term: Term | null
  payrollReceiptUrl: string | null
  payrollReceiptFilename: string | null
  payrollReceiptContentType: string | null
  payrollReceiptSize: string | null
  payrollReceiptUploadedAt: string | null
  contractUrl: string | null
  contractFilename: string | null
  contractContentType: string | null
  contractSize: string | null
  contractUploadedAt: string | null
  authorizationUrl: string | null
  authorizationFilename: string | null
  authorizationContentType: string | null
  authorizationSize: string | null
  authorizationUploadedAt: string | null
  reason: string | null
}

export interface Term extends ObjectWithId, Timestamps {
  name?: string
  durationType: DurationType
  duration: number
}

export interface Company extends ObjectWithId, Timestamps {
  domain: string
  name: string
  rate: number | null
  borrowingCapacity: number | null
  employeeSalaryFrequency: "biweekly" | "monthly"
  terms: Term[]
}

export type NotificationType =
  | "PendingUser"
  | "PreAuthorizationUser"
  | "DeniedUser"
  | "InvalidDocumentationUser"
  | "PreAuthorizedUser"
  | "PendingCredit"
  | "InvalidDocumentationCredit"
  | "AuthorizedCredit"
  | "DeniedCredit"
  | "DispersedCredit"
  | "InstalledCredit"

export type Role =
  | "requests"
  | "pre_authorizations"
  | "authorizations"
  | "dispersions"
  | "payments"
  | "admin"
  | "companies"
  | "hr"

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

export type HRStatus = "approved" | "denied"

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
  hrCompanyId: number | null
}

export interface ObjectWithId {
  id: string
}

export interface Timestamps {
  createdAt: string
  updatedAt: string
}

export type DocumentStatus = "pending" | "approved" | "rejected" | null

export type StateOfMexico =
  | "AGU"
  | "BCN"
  | "BCS"
  | "CAM"
  | "CHP"
  | "CHH"
  | "COA"
  | "COL"
  | "DUR"
  | "GUA"
  | "GRO"
  | "HID"
  | "JAL"
  | "MEX"
  | "MIC"
  | "MOR"
  | "NAY"
  | "NLE"
  | "OAX"
  | "PUE"
  | "QUE"
  | "ROO"
  | "SLP"
  | "SIN"
  | "SON"
  | "TAB"
  | "TAM"
  | "TLA"
  | "VER"
  | "YUC"
  | "ZAC"

export interface User extends ObjectWithId, Timestamps {
  addressLineOne: string | null
  addressLineTwo: string | null
  bankAccountNumber: string | null
  city: string | null
  country: "MX" | null
  email: string
  employeeNumber: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
  postalCode: string | null
  rfc: string | null
  salary: number | null
  state: StateOfMexico | null
  status: UserStatus | null
  identityDocumentUrl: string | null
  identityDocumentContentType: string | null
  identityDocumentFilename: string | null
  identityDocumentSize: string | null
  identityDocumentUploadedAt: string | null
  identityDocumentStatus: DocumentStatus
  identityDocumentRejectionReason: string | null
  payrollReceiptUrl: string | null
  payrollReceiptContentType: string | null
  payrollReceiptFilename: string | null
  payrollReceiptSize: string | null
  payrollReceiptUploadedAt: string | null
  payrollReceiptStatus: DocumentStatus
  payrollReceiptRejectionReason: string | null
  proofOfAddressUrl: string | null
  proofOfAddressContentType: string | null
  proofOfAddressFilename: string | null
  proofOfAddressSize: string | null
  proofOfAddressUploadedAt: string | null
  proofOfAddressStatus: DocumentStatus
  proofOfAddressRejectionReason: string | null
  bankStatementUrl: string | null
  bankStatementContentType: string | null
  bankStatementFilename: string | null
  bankStatementSize: string | null
  bankStatementUploadedAt: string | null
  bankStatementStatus: DocumentStatus
  bankStatementRejectionReason: string | null
  reason: string | null
}

export interface TermOffering extends ObjectWithId, Timestamps {
  term: Term
  company: Company
  credits: Credit[] | null
}

export interface Credit extends ObjectWithId, Timestamps {
  amortization: `${number}` | null
  authorizationContentType: string | null
  authorizationFilename: string | null
  authorizationRejectionReason: string | null
  authorizationSize: string | null
  authorizationStatus: DocumentStatus
  authorizationUploadedAt: string | null
  authorizationUrl: string | null
  borrower: User
  contractContentType: string | null
  contractFilename: string | null
  contractRejectionReason: string | null
  contractSize: string | null
  contractStatus: DocumentStatus
  contractUploadedAt: string | null
  contractUrl: string | null
  creditAmount: `${number}` | null
  dispersedAt: string | null
  hrStatus: HRStatus | null
  installationDate: string | null
  installationStatus: "installed" | null
  loan: number | null
  maxLoanAmount: `${number}` | null
  nextExpectedPayment: string | null
  payments: Payment[] | null
  payrollReceiptContentType: string | null
  payrollReceiptFilename: string | null
  payrollReceiptRejectionReason: string | null
  payrollReceiptSize: string | null
  payrollReceiptStatus: DocumentStatus
  payrollReceiptUploadedAt: string | null
  payrollReceiptUrl: string | null
  reason: string | null
  status: CreditStatus
  termOffering: TermOffering | null
}

export interface Term extends ObjectWithId, Timestamps {
  name?: string
  durationType: DurationType
  duration: number
}

export interface Company extends ObjectWithId, Timestamps {
  domain: string
  name: string
  rate: number
  borrowingCapacity: number | null
  employeeSalaryFrequency: "biweekly" | "monthly"
  terms: Term[] | null
  termOfferings: TermOffering[] | null
  credits: Credit[] | null
}

export interface Payment extends ObjectWithId, Timestamps {
  paidAt: string
  amount: number
  credit: Credit
  number: number
}

export interface Notification extends ObjectWithId, Timestamps {
  message: string
}

export interface Event extends ObjectWithId, Timestamps {
  record: unknown
  message: string
  type: NotificationType
  params: Record<string, unknown>
}

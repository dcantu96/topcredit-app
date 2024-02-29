export type Role =
  | "admin"
  | "requests"
  | "companies"
  | "pre_authorizations"
  | "authorizations"

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
  status: string | null
}

export interface Credit extends ObjectWithId, Timestamps {
  loan: number | null
  status: CreditStatus
  borrower: User
  term: Term
}

export interface Term extends ObjectWithId, Timestamps {
  name?: string
  durationType: string
  duration: number
}

export interface Company extends ObjectWithId, Timestamps {
  domain: string
  name: string
  rate: number | null
  borrowingCapacity: number | null
  terms: Term[]
}

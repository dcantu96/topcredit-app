export type Role = "admin" | "requests" | "companies" | "pre_authorizations"

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

export interface Term extends ObjectWithId, Timestamps {
  name?: string
  durationType: string
  duration: number
}

export interface Company extends ObjectWithId, Timestamps {
  domain: string
  name: string
  rate: number | null
  terms: Term[]
}

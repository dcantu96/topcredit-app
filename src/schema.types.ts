export type Role = "admin" | "requests";

export interface TokenResponse {
  access_token: string;
  created_at: number;
  expires_in: number;
  token_type: string;
}

export interface MeResponse {
  email: string;
  id: number;
  firstName: string | null;
  lastName: string | null;
  role: Role | null;
}

export interface ObjectWithId {
  id: number;
}

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface User extends ObjectWithId, Timestamps {
  addressLineOne: string | null;
  addressLineTwo: string | null;
  bankAccountNumber: string | null;
  city: string | null;
  country: string | null;
  email: string;
  employeeNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  postalCode: string | null;
  rfc: string | null;
  salary: number | null;
  salaryFrequency: string | null;
  state: string | null;
  status: string | null;
}

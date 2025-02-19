import {
  CreditStatus,
  DurationType,
  HRStatus,
  Role,
  SidebarRoutes,
  UserStatus,
} from "./schema.types"

export const STATES_OF_MEXICO = [
  { value: "AGU" as const, label: "Aguascalientes" },
  { value: "BCN" as const, label: "Baja California" },
  { value: "BCS" as const, label: "Baja California Sur" },
  { value: "CAM" as const, label: "Campeche" },
  { value: "CHP" as const, label: "Chiapas" },
  { value: "CHH" as const, label: "Chihuahua" },
  { value: "COA" as const, label: "Coahuila" },
  { value: "COL" as const, label: "Colima" },
  { value: "DUR" as const, label: "Durango" },
  { value: "GUA" as const, label: "Guanajuato" },
  { value: "GRO" as const, label: "Guerrero" },
  { value: "HID" as const, label: "Hidalgo" },
  { value: "JAL" as const, label: "Jalisco" },
  { value: "MEX" as const, label: "México" },
  { value: "MIC" as const, label: "Michoacán" },
  { value: "MOR" as const, label: "Morelos" },
  { value: "NAY" as const, label: "Nayarit" },
  { value: "NLE" as const, label: "Nuevo León" },
  { value: "OAX" as const, label: "Oaxaca" },
  { value: "PUE" as const, label: "Puebla" },
  { value: "QUE" as const, label: "Querétaro" },
  { value: "ROO" as const, label: "Quintana Roo" },
  { value: "SLP" as const, label: "San Luis Potosí" },
  { value: "SIN" as const, label: "Sinaloa" },
  { value: "SON" as const, label: "Sonora" },
  { value: "TAB" as const, label: "Tabasco" },
  { value: "TAM" as const, label: "Tamaulipas" },
  { value: "TLA" as const, label: "Tlaxcala" },
  { value: "VER" as const, label: "Veracruz" },
  { value: "YUC" as const, label: "Yucatán" },
  { value: "ZAC" as const, label: "Zacatecas" },
]

export const COUNTRIES = [{ value: "MX" as const, label: "México" }]

export const ROLES: { value: SidebarRoutes; label: string; path: string }[] = [
  { value: "requests", label: "Sol", path: "requests" },
  {
    value: "pre_authorizations",
    label: "Pre-Aut",
    path: "pre-authorizations",
  },
  { value: "admin", label: "Administrador", path: "administrador" },
  {
    value: "authorizations",
    label: "Aut",
    path: "pending-authorizations",
  },
  { value: "dispersions", label: "Disp", path: "dispersions" },
  { value: "payments", label: "Cobranza", path: "payments" },
  { value: "payments", label: "Bajas", path: "completed-credits" },
  { value: "admin", label: "Staff", path: "staff" },
]

export interface RoleOption {
  value: Role
  label: string
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    label: "Administrador",
    value: "admin",
  },
  {
    label: "Autorizaciones",
    value: "authorizations",
  },
  {
    label: "Cobranza",
    value: "payments",
  },
  {
    label: "Dispersiones",
    value: "dispersions",
  },
  {
    label: "Pre-autorizaciones",
    value: "pre_authorizations",
  },
  {
    label: "RH",
    value: "hr",
  },
  {
    label: "Solicitudes",
    value: "requests",
  },
]

export const SORT_ORDER = [
  { label: "Más recientes", value: "desc" as const },
  { label: "Más antiguas", value: "asc" as const },
]

export const MXNFormat = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
})

export const DURATION_TYPES = new Map<DurationType, string>([
  ["two-weeks", "Quincenas"],
  ["months", "Meses"],
  ["years", "Años"],
])

export const SALARY_FREQUENCIES = new Map<"Q" | "M", "Quincenas" | "Meses">([
  ["Q", "Quincenas"],
  ["M", "Meses"],
])

export const FREQUENCY_OPTIONS = [
  { value: "monthly" as const, label: "Mensual" },
  { value: "biweekly" as const, label: "Quincenal" },
]

export const CREDIT_STATUS = new Map<CreditStatus, string>([
  ["new", "Nuevo"],
  ["pending", "Pendiente"],
  ["invalid-documentation", "Documentación inválida"],
  ["authorized", "Autorizado"],
  ["denied", "Denegado"],
  ["dispersed", "Dispersado"],
])

export const USER_STATUSES = new Map<UserStatus, string>([
  ["new", "Nuevo"],
  ["pending", "Pendiente"],
  ["invalid-documentation", "Documentación inválida"],
  ["pre-authorization", "Pre-autorización"],
  ["pre-authorized", "Pre-autorizado"],
  ["denied", "Denegado"],
])

export const HR_STATUS = new Map<HRStatus, string>([
  ["approved", "Aprobado"],
  ["denied", "Rechazado"],
])

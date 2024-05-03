import { DurationType, Role } from "./schema.types"

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

export const ROLES: { value: Role; label: string; path: string }[] = [
  { value: "requests" as const, label: "Sol", path: "requests" },
  {
    value: "pre_authorizations" as const,
    label: "Pre-Aut",
    path: "pre-authorizations",
  },
  { value: "admin" as const, label: "Administrador", path: "administrador" },
  {
    value: "authorizations" as const,
    label: "Aut",
    path: "pending-authorizations",
  },
  { value: "dispersions" as const, label: "Disp", path: "dispersions" },
  {
    value: "installations" as const,
    label: "Inst",
    path: "installations",
  },
  { value: "payments" as const, label: "Cobranza", path: "payments" },
  { value: "payments" as const, label: "Bajas", path: "completed-credits" },
  { value: "admin" as const, label: "Staff", path: "staff" },
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

import { Role } from "./schema.types"

export const STATES_OF_MEXICO = [
  { value: "AGU", label: "Aguascalientes" },
  { value: "BCN", label: "Baja California" },
  { value: "BCS", label: "Baja California Sur" },
  { value: "CAM", label: "Campeche" },
  { value: "CHP", label: "Chiapas" },
  { value: "CHH", label: "Chihuahua" },
  { value: "COA", label: "Coahuila" },
  { value: "COL", label: "Colima" },
  { value: "DUR", label: "Durango" },
  { value: "GUA", label: "Guanajuato" },
  { value: "GRO", label: "Guerrero" },
  { value: "HID", label: "Hidalgo" },
  { value: "JAL", label: "Jalisco" },
  { value: "MEX", label: "México" },
  { value: "MIC", label: "Michoacán" },
  { value: "MOR", label: "Morelos" },
  { value: "NAY", label: "Nayarit" },
  { value: "NLE", label: "Nuevo León" },
  { value: "OAX", label: "Oaxaca" },
  { value: "PUE", label: "Puebla" },
  { value: "QUE", label: "Querétaro" },
  { value: "ROO", label: "Quintana Roo" },
  { value: "SLP", label: "San Luis Potosí" },
  { value: "SIN", label: "Sinaloa" },
  { value: "SON", label: "Sonora" },
  { value: "TAB", label: "Tabasco" },
  { value: "TAM", label: "Tamaulipas" },
  { value: "TLA", label: "Tlaxcala" },
  { value: "VER", label: "Veracruz" },
  { value: "YUC", label: "Yucatán" },
  { value: "ZAC", label: "Zacatecas" },
]

export const COUNTRIES = [{ value: "MX", label: "México" }]

export const ROLES: { value: Role; label: string }[] = [
  { value: "requests", label: "Solicitudes" },
  { value: "pre_authorizations", label: "Pre Autorizaciones" },
  { value: "admin", label: "Administrador" },
]

export const SORT_ORDER = [
  { label: "Más recientes", value: "desc" as const },
  { label: "Más antiguas", value: "asc" as const },
]

export const MXNFormat = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
})

import { clabe } from "clabe-validator"
import validateRfc from "validate-rfc"

export const postalCodeFieldValidation = (text: string) => {
  if (text.length === 0) return "El código postal no puede estar vacío"
  if (text.match(/\D/)) return "El código postal solo puede contener números"
  if (text.length !== 5) return "El código postal debe tener 5 dígitos"
  return undefined
}

export const bankAccountNumberFieldValidation = (text: string) => {
  const validation = clabe.validate(text)
  if (validation.ok) return undefined
  if (validation.error === "invalid-length")
    return "La cuenta debe tener 18 dígitos"

  return "La cuenta no es válida"
}

export const rfcFieldValidation = (text: string) => {
  const validation = validateRfc(text)
  if (validation.isValid) return undefined

  return "El RFC no es válido"
}

export const salaryFrequencyFieldValidation = (text: string) => {
  if (text.length === 0) return "La frecuencia de pago no puede estar vacía"
  if (!text.match(/\D/) || text.length > 2)
    return "Frecuencia de pago no válida"
  return undefined
}

export const salaryFieldValidation = (text: string) => {
  if (text.length === 0) return "El salario no puede estar vacío"
  if (!text.match(/^\d+(?:\.\d+)?$/)) return "El salario no es válido"
  return undefined
}

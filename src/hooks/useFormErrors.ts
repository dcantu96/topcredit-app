import { useEffect, useState } from "react"

export const useFormErrors = () => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    return () => clearErrors()
  }, [])
  const handleErrors = (error: unknown, fields: Set<string>) => {
    if (typeof error === "object" && error !== null && "errors" in error) {
      const newErrorsObject: Record<string, string> = {}
      for (const errorItem of error.errors as { detail: string }[]) {
        const [fieldKey, message] = errorItem.detail.split(" - ")
        if (fields.has(fieldKey)) {
          newErrorsObject[fieldKey] = message
        }
      }
      setFormErrors(newErrorsObject)
    }
  }

  const clearErrors = () => {
    setFormErrors({})
  }

  return {
    errors: formErrors,
    handleErrors,
    clearErrors,
  }
}

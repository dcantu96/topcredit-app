export const isJsonApiError = (error: unknown): error is JsonApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray(error.errors)
  )
}

export interface JsonApiError {
  errors: JsonApiErrorItem[]
}

export interface JsonApiErrorItem {
  title: string
  detail: string
  source: JsonApiErrorSource
  code: string
  status: string
}

export interface JsonApiErrorSource {
  pointer: string
  parameter?: string
}

export const getFileFromEvent = (
  e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
) => {
  if ("dataTransfer" in e && e.dataTransfer.files) {
    return e.dataTransfer.files?.[0] // For drag and drop
  } else if ("target" in e && "files" in e.target) {
    return e.target.files?.[0] // For file input
  }
}

export interface CSVRow {
  [key: string]: string
}

export interface ReadFileCallbacks {
  onLoad?: (csvRows: CSVRow[], headers: string[]) => void
  onLoadStart?: () => void
  onLoadStop?: () => void
  onError?: (error: string) => void
}

export const parseCSV = (csvText: string) => {
  const lines = csvText.split("\n")
  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().replaceAll('"', ""))
  const dataLines = lines.slice(1)

  const data = dataLines.map((line) => {
    const values = line.split(",")
    const entry = headers.reduce<CSVRow>((obj, header, index) => {
      const value = values[index]
      if (!value) return obj
      const cleanedValue = value.trim().replace(/"/g, "")
      obj[header.trim()] = cleanedValue
      return obj
    }, {})
    const firstValue = values[0]
    entry.id = firstValue
    return entry
  })

  return {
    headers,
    data,
  }
}

export const readFile = (file: File, callbacks: ReadFileCallbacks) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    // Check if the result is present and is of type string before attempting to parse it
    if (e.target?.result && typeof e.target.result === "string") {
      callbacks.onLoadStart?.()
      const { data, headers } = parseCSV(e.target.result)
      callbacks.onLoad?.(data, headers)
      callbacks.onLoadStop?.()
    } else {
      console.error("File could not be read as text.")
    }
  }
  reader.onerror = (e) => {
    console.error("Error reading file:", e.target?.error?.message)
    const message = e.target?.error?.message
    if (message) callbacks.onError?.(message)
  }
  reader.readAsText(file)
}

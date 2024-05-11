import { useRef } from "react"

import Button from "components/atoms/button"
import { getFileFromEvent } from "components/atoms/utils"

import { DocumentArrowDownIcon } from "@heroicons/react/24/solid"

interface ImportDocumentButtonProps {
  id: string
  onImport?: (file: File) => Promise<void>
}

const ImportDocumentButton = ({ id, onImport }: ImportDocumentButtonProps) => {
  const ref = useRef<HTMLInputElement>(null)

  const handleImport = () => ref.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = getFileFromEvent(e)
    if (file) await onImport?.(file)
    e.target.value = ""
  }

  return (
    <>
      <input
        ref={ref}
        id={id}
        name={id}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <Button size="sm" status="secondary" onClick={handleImport}>
        Importar
        <DocumentArrowDownIcon className="h-4 w-4 ml-1" />
      </Button>
    </>
  )
}

export default ImportDocumentButton

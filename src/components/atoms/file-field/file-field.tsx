import { TrashIcon } from "@heroicons/react/24/solid"
import { DocumentIcon } from "@heroicons/react/24/solid"
import useFileUpload from "hooks/useFileUpload"
import { useRef, useState } from "react"
import Button from "../button"

export interface ReadonlyFile {
  url: string
  filename: string
  contentType: string
  size: string
  uploadedAt: string
}

interface FileFieldProps {
  /**
   * This function is called when a file is uploaded
   */
  handleFileUpload: (e: {
    file: File | undefined
    signedId: string | undefined
  }) => void
  label: string
  description?: string
  id: string
  error?: boolean | string
  required?: boolean
  initialFile?: ReadonlyFile
  disableRemove?: boolean
  onRemove?: () => void
}

const FileField = ({
  handleFileUpload,
  label,
  id,
  description,
  error,
  required,
  disableRemove,
  initialFile,
  onRemove,
}: FileFieldProps) => {
  const { uploadFile } = useFileUpload()
  const [file, setFile] = useState<File | undefined | null>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState<boolean>(false)

  const handleDragEnter = () => {
    setIsDragActive(true)
  }

  const handleDragLeave = () => {
    setIsDragActive(false)
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    setIsDragActive(false)
  }

  const getFileFromEvent = (
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    if ("dataTransfer" in e && e.dataTransfer.files) {
      return e.dataTransfer.files?.[0] // For drag and drop
    } else if ("target" in e && "files" in e.target) {
      return e.target.files?.[0] // For file input
    }
  }

  const handleFileChange = async (
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = getFileFromEvent(e)
    if (file) {
      const { signedId } = await uploadFile(file)
      setFile(file)
      handleFileUpload({ file, signedId })
    }
    setIsDragActive(false)
  }

  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      {description && (
        <p className="text-xs leading-3 text-gray-600">{description}</p>
      )}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleChooseFile}
        onDrop={handleDrop}
        aria-pressed={"false"}
        className={`mt-2 flex justify-center rounded-lg border border-dashed cursor-pointer px-6 py-10 aria-pressed:border-indigo-600 ${
          isDragActive
            ? "border-indigo-600"
            : error
              ? "border-rose-600"
              : "border-gray-900/25"
        }`}
      >
        {(!initialFile && !file) || file === null ? (
          <div className="text-center pointer-events-none">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                clipRule="evenodd"
              />
            </svg>

            <div
              className={` mt-4 flex text-sm leading-6 text-gray-600 justify-center`}
            >
              <span className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                <span>Sube un archivo</span>
              </span>
              <input
                type="file"
                id={id}
                name={id}
                required={required}
                ref={fileInputRef}
                onChange={handleFileChange}
                className="sr-only"
              />
              <p className="pl-1">o arrasta y sueltalo aquí</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF hasta 10MB
            </p>
          </div>
        ) : initialFile && !file ? (
          <ChosenFile
            disableRemove={disableRemove}
            file={initialFile}
            onRemove={() => {
              onRemove?.()
              setFile(null)
            }}
          />
        ) : file ? (
          <ChosenFile
            disableRemove={disableRemove}
            onRemove={() => {
              setFile(null)
              onRemove?.()
            }}
            file={{
              url: "",
              contentType: file.type,
              filename: file.name,
              size: file.size.toString(),
              uploadedAt: file.lastModified.toString(),
            }}
          />
        ) : null}
      </div>
      {typeof error === "string" && (
        <p className="leading-6 text-sm text-rose-600">{error}</p>
      )}
    </>
  )
}

const ChosenFile = ({
  file,
  onRemove,
  disableRemove,
}: {
  file: ReadonlyFile
  onRemove?: () => void
  disableRemove?: boolean
}) => {
  const navigate = () => {
    if (!file.url) return
    window.open(file.url, "_blank")
  }

  return (
    <div className="w-full" onClick={navigate}>
      <p
        className={`${
          file.url ? "text-indigo-600" : "text-gray-900"
        } font-medium mb-2 inline-flex`}
      >
        <DocumentIcon className="h-5 w-5 text-gray-500 mr-2" /> {file.filename}
      </p>

      <p className="text-gray-500 text-sm mb-4">
        {new Date(file.uploadedAt).toLocaleDateString()} &#x2022; {file.size}{" "}
        &#x2022; {file.contentType}
      </p>
      <Button
        type="button"
        size="sm"
        status="dark"
        disabled={disableRemove}
        onClick={(e) => {
          e.stopPropagation()
          onRemove?.()
        }}
      >
        Eliminar <TrashIcon className="ml-2 h-5 w-5 text-white" />
      </Button>
    </div>
  )
}

export default FileField

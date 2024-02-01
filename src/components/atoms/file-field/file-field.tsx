import { useRef, useState } from "react"

interface FileFieldProps {
  handleFile: (
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
  ) => void
  label: string
  description?: string
  id: string
  error?: boolean | string
}

const FileField = ({
  handleFile,
  label,
  id,
  description,
  error,
}: FileFieldProps) => {
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

    handleFile(e)
    setIsDragActive(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFile(e)
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
      </div>
      {typeof error === "string" && (
        <p className="leading-6 text-sm text-rose-600">{error}</p>
      )}
    </>
  )
}

export default FileField

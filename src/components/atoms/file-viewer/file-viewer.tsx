import { TrashIcon } from "@heroicons/react/24/outline"
import { DocumentIcon } from "@heroicons/react/24/solid"

interface FileViewerProps {
  label: string
  fileName?: string
  fileDate?: string
  fileSize?: string
  contentType?: string
  fileUrl?: string
  onDelete?: () => void
}

const FileViewer = ({
  label,
  fileDate = "-",
  fileName = "-",
  fileSize = "-",
  contentType,
  fileUrl,
  onDelete,
}: FileViewerProps) => {
  return (
    <>
      <label className="text-gray-900 font-medium leading-6 text-sm">
        {label}
      </label>
      <div
        className="ring-1 ring-gray-300 rounded-md w-full p-4 mt-2"
        onClick={() => {
          if (!fileUrl) return
          window.open(fileUrl, "_blank")
        }}
      >
        <div className="flex justify-between w-full mb-4">
          <DocumentIcon className="h-5 w-5 text-gray-500" />

          <TrashIcon
            onClick={(e) => {
              console.log("click")
              e.stopPropagation()
              onDelete && onDelete()
            }}
            className="h-5 w-5 text-red-500"
          />
        </div>
        <p className="text-gray-900 font-medium mb-2">{fileName}</p>
        <p className="text-gray-500 text-sm">
          {new Date(fileDate).toLocaleDateString()} &#x2022;{" "}
          {bytesToMb(Number(fileSize))} &#x2022; {contentType}
        </p>
      </div>
    </>
  )
}

const bytesToMb = (bytes: number) => {
  return (bytes / (1024 * 1024)).toFixed(2) + "MB"
}

export default FileViewer

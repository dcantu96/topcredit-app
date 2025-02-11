import { TrashIcon } from "@heroicons/react/24/outline"
import { CheckIcon, DocumentIcon, XMarkIcon } from "@heroicons/react/24/solid"
import Button from "../button"
import { DocumentStatus } from "src/schema.types"
import { useState } from "react"
import Dialog from "components/molecules/dialog"

interface FileViewerProps {
  label: string
  fileName?: string
  fileDate?: string
  fileSize?: string
  contentType?: string
  fileUrl?: string
  onDelete?: () => void
  children?: React.ReactNode
}

const FileViewer = ({
  label,
  fileDate = "-",
  fileName = "-",
  fileSize = "-",
  contentType,
  fileUrl,
  onDelete,
  children,
}: FileViewerProps) => {
  return (
    <>
      <label className="text-gray-900 font-medium leading-6 text-sm">
        {label}
      </label>
      <div className={`ring-1 ring-gray-300 rounded-md w-full p-4 mt-2`}>
        <div className="flex justify-between w-full mb-4">
          <DocumentIcon
            className="h-5 w-5 text-gray-500"
            onClick={() => {
              if (!fileUrl) return
              window.open(fileUrl, "_blank")
            }}
          />
          {children}

          {onDelete && (
            <TrashIcon
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="h-5 w-5 text-red-500"
            />
          )}
        </div>
        <p
          onClick={() => {
            if (!fileUrl) return
            window.open(fileUrl, "_blank")
          }}
          className={`${
            fileUrl ? "text-indigo-600" : "text-gray-900"
          } font-medium mb-2 inline-flex cursor-pointer`}
        >
          {fileName}
        </p>
        <p className="text-gray-500 text-sm">
          {new Date(fileDate).toLocaleDateString()} &#x2022;{" "}
          {bytesToMb(Number(fileSize))} &#x2022; {contentType}
        </p>
      </div>
    </>
  )
}

interface StatusButtonsProps {
  status: DocumentStatus
  onApprove: () => void
  onDeny: (rejectReason: string) => void
}

const StatusButtons = ({ status, onApprove, onDeny }: StatusButtonsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  return (
    <>
      <div className="flex gap-2">
        {!status || status === "pending" ? (
          <>
            <Button
              size="sm"
              status="secondary"
              onClick={(e) => {
                e.stopPropagation()
                openModal()
              }}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              status="secondary"
              onClick={(e) => {
                e.stopPropagation()
                onApprove()
              }}
            >
              <CheckIcon className="h-5 w-5" />
            </Button>
          </>
        ) : status === "approved" ? (
          <>
            <Button
              size="sm"
              status="secondary"
              onClick={(e) => {
                e.stopPropagation()
                openModal()
              }}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
            <Button size="sm" status="dark">
              <CheckIcon className="h-5 w-5 text-white" />
            </Button>
          </>
        ) : status === "rejected" ? (
          <>
            <Button size="sm" status="dark">
              <XMarkIcon className="h-5 w-5 text-white" />
            </Button>
            <Button
              size="sm"
              status="secondary"
              onClick={(e) => {
                e.stopPropagation()
                onApprove()
              }}
            >
              <CheckIcon className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <span className="text-gray-500">Sin acción</span>
        )}
      </div>
      {isModalOpen && (
        <Dialog
          title="Rechazar documento"
          message="Escribe el motivo de rechazo del documento."
          type="danger"
          onCancel={closeModal}
          inputLabel="Motivo de rechazo"
          onClose={(rejectReason) => {
            if (!rejectReason) return
            onDeny(rejectReason)
            closeModal()
          }}
        />
      )}
    </>
  )
}

const bytesToMb = (bytes: number) => {
  return (bytes / (1024 * 1024)).toFixed(2) + "MB"
}

FileViewer.StatusButtons = StatusButtons

export default FileViewer

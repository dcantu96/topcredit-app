import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import {
  bankStatementRejectionReasonState,
  bankStatementStatusState,
  basicDetailsSelector,
  identityDocumentRejectionReasonState,
  identityDocumentStatusState,
  payrollReceiptRejectionReasonState,
  payrollReceiptStatusState,
  proofOfAddressRejectionReasonState,
  proofOfAddressStatusState,
} from "./atoms"
import { CheckIcon, DocumentIcon } from "@heroicons/react/24/solid"
import Button from "components/atoms/button"
import FileViewer from "components/atoms/file-viewer/file-viewer"
import { useRequestActions } from "./actions"
import { MXNFormat } from "../../constants"
import { companiesDataSelector } from "../companies/loader"
import Tooltip from "components/atoms/tooltip"
import { TrashIcon } from "@heroicons/react/24/outline"

const ShowRequest = () => {
  const { id } = useParams()
  if (!id || Number.isNaN(id)) throw new Error("Missing id param")
  const user = useRecoilValue(basicDetailsSelector(Number(id)))
  const companies = useRecoilValue(
    companiesDataSelector({
      filter: {
        domain: user?.email.split("@")[1],
      },
    }),
  )
  const employeeSalaryFrequency = companies?.[0]?.employeeSalaryFrequency
  const {
    approveUser,
    denyUser,
    missingDocumentation,
    approveDocument,
    denyDocument,
  } = useRequestActions(Number(id))
  const bankStatementStatus = useRecoilValue(
    bankStatementStatusState(Number(id)),
  )
  const proofOfAddressStatus = useRecoilValue(
    proofOfAddressStatusState(Number(id)),
  )
  const identityDocumentStatus = useRecoilValue(
    identityDocumentStatusState(Number(id)),
  )
  const payrollReceiptStatus = useRecoilValue(
    payrollReceiptStatusState(Number(id)),
  )
  const proofOfAddressRejectionReason = useRecoilValue(
    proofOfAddressRejectionReasonState(Number(id)),
  )
  const identityDocumentRejectionReason = useRecoilValue(
    identityDocumentRejectionReasonState(Number(id)),
  )
  const payrollReceiptRejectionReason = useRecoilValue(
    payrollReceiptRejectionReasonState(Number(id)),
  )
  const bankStatementRejectionReason = useRecoilValue(
    bankStatementRejectionReasonState(Number(id)),
  )

  if (!user) return null

  return (
    <div className="flex flex-col container lg:w-2/3 mx-auto px-4 py-4">
      <div className="lg:flex lg:items-center lg:justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {user.firstName} {user.lastName}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                aria-hidden="true"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM16 12V13.5C16 14.8807 17.1193 16 18.5 16V16C19.8807 16 21 14.8807 21 13.5V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
              soriana.com
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                  clipRule="evenodd"
                />
              </svg>
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="flex gap-2">
            <Button
              onClick={approveUser}
              disabled={
                identityDocumentStatus !== "approved" ||
                proofOfAddressStatus !== "approved" ||
                bankStatementStatus !== "approved" ||
                payrollReceiptStatus !== "approved"
              }
            >
              <CheckIcon className="h-5 w-5 text-white mr-1.5" />
              Aprobar
            </Button>
            <Button status="secondary" onClick={denyUser}>
              <TrashIcon className="h-5 w-5 mr-1.5" />
              Eliminar
            </Button>
            <Button
              status="secondary"
              disabled={
                identityDocumentStatus !== "rejected" &&
                proofOfAddressStatus !== "rejected" &&
                bankStatementStatus !== "rejected" &&
                payrollReceiptStatus !== "rejected"
              }
              onClick={missingDocumentation}
            >
              <DocumentIcon className="h-5 w-5 mr-1.5" />
              Doc. Inválida
            </Button>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8">
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            Numero de Nomina
          </label>
          <p className="text-gray-900 font-medium">{user.employeeNumber}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">RFC</label>
          <p className="text-gray-900 font-medium">{user.rfc}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Ingresos</label>
          <p className="text-gray-900 font-medium">
            {user.salary ? MXNFormat.format(user.salary) : "--"} MXN{" "}
            {employeeSalaryFrequency === "biweekly"
              ? "Quincenales"
              : "Mensuales"}
          </p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            CLABE Interbancaria
          </label>
          <p className="text-gray-900 font-medium">{user.bankAccountNumber}</p>
        </div>
        <div className="col-span-2">
          <h1 className="text-gray-900 font-bold text-xl">Domicilio</h1>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            Calle y numero
          </label>
          <p className="text-gray-900 font-medium">{user.addressLineOne}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            Numero interior
          </label>
          <p className="text-gray-900 font-medium">{user.addressLineTwo}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Ciudad</label>
          <p className="text-gray-900 font-medium">{user.city}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Estado</label>
          <p className="text-gray-900 font-medium">{user.state}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">País</label>
          <p className="text-gray-900 font-medium">{user.country}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            Código Postal
          </label>
          <p className="text-gray-900 font-medium">{user.postalCode}</p>
        </div>
        <div className="col-span-2">
          <h1 className="text-gray-900 font-bold text-xl">Documentos</h1>
        </div>
        <div className="col-span-1">
          <FileViewer
            label="Identificación Oficial"
            fileUrl={user.identityDocumentUrl ?? undefined}
            fileName={user.identityDocumentFilename ?? undefined}
            fileDate={user.identityDocumentUploadedAt ?? undefined}
            fileSize={user.identityDocumentSize ?? undefined}
          >
            <Tooltip
              content={identityDocumentRejectionReason}
              cond={identityDocumentStatus === "rejected"}
            >
              <FileViewer.StatusButtons
                status={identityDocumentStatus}
                onApprove={approveDocument("identityDocument")}
                onDeny={denyDocument("identityDocument")}
              />
            </Tooltip>
          </FileViewer>
        </div>

        <div className="col-span-1">
          <FileViewer
            label="Comprobante de Domicilio"
            fileUrl={user.proofOfAddressUrl ?? undefined}
            fileName={user.proofOfAddressFilename ?? undefined}
            fileDate={user.proofOfAddressUploadedAt ?? undefined}
            fileSize={user.proofOfAddressSize ?? undefined}
          >
            <Tooltip
              content={proofOfAddressRejectionReason}
              cond={proofOfAddressStatus === "rejected"}
            >
              <FileViewer.StatusButtons
                status={proofOfAddressStatus}
                onApprove={approveDocument("proofOfAddress")}
                onDeny={denyDocument("proofOfAddress")}
              />
            </Tooltip>
          </FileViewer>
        </div>

        <div className="col-span-1">
          <FileViewer
            label="Estado de Cuenta"
            fileUrl={user.bankStatementUrl ?? undefined}
            fileName={user.bankStatementFilename ?? undefined}
            fileDate={user.bankStatementUploadedAt ?? undefined}
            fileSize={user.bankStatementSize ?? undefined}
          >
            <Tooltip
              content={bankStatementRejectionReason}
              cond={bankStatementStatus === "rejected"}
            >
              <FileViewer.StatusButtons
                status={bankStatementStatus}
                onApprove={approveDocument("bankStatement")}
                onDeny={denyDocument("bankStatement")}
              />
            </Tooltip>
          </FileViewer>
        </div>

        <div className="col-span-1">
          <FileViewer
            label="Recibo de Nómina"
            fileUrl={user.payrollReceiptUrl ?? undefined}
            fileName={user.payrollReceiptFilename ?? undefined}
            fileDate={user.payrollReceiptUploadedAt ?? undefined}
            fileSize={user.payrollReceiptSize ?? undefined}
          >
            <Tooltip
              content={payrollReceiptRejectionReason}
              cond={payrollReceiptStatus === "rejected"}
            >
              <FileViewer.StatusButtons
                status={payrollReceiptStatus}
                onApprove={approveDocument("payrollReceipt")}
                onDeny={denyDocument("bankStatement")}
              />
            </Tooltip>
          </FileViewer>
        </div>
      </div>
    </div>
  )
}

export default ShowRequest

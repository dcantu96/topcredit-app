import { useNavigate, useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { CheckIcon, DocumentIcon, XMarkIcon } from "@heroicons/react/24/solid"

import Button from "components/atoms/button"
import FileViewer from "components/atoms/file-viewer/file-viewer"
import useCreditActions from "hooks/useCreditActions"
import useCompanies from "hooks/useCompanies"
import useCreditAmortization from "hooks/useCreditAmortization"

import {
  authorizationRejectionReasonCreditState,
  authorizationStatusCreditState,
  contractRejectionReasonCreditState,
  contractStatusCreditState,
  creditSelector,
  payrollReceiptRejectionReasonCreditState,
  payrollReceiptStatusCreditState,
} from "./atoms"
import { usePendingAuthorizationsActions } from "./actions"
import { DURATION_TYPES, MXNFormat } from "../../constants"
import Tooltip from "components/atoms/tooltip"

const ShowScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  if (!id || Number.isNaN(id)) throw new Error("Missing id param")
  const credit = useRecoilValue(creditSelector(id))
  const contractStatus = useRecoilValue(contractStatusCreditState(id))
  const contractRejectionReason = useRecoilValue(
    contractRejectionReasonCreditState(id),
  )
  const payrollReceiptStatus = useRecoilValue(
    payrollReceiptStatusCreditState(id),
  )
  const payrollReceiptRejectionReason = useRecoilValue(
    payrollReceiptRejectionReasonCreditState(id),
  )
  const authorizationStatus = useRecoilValue(authorizationStatusCreditState(id))
  const authorizationRejectionReason = useRecoilValue(
    authorizationRejectionReasonCreditState(id),
  )

  if (!credit) throw new Error("Credit not found")
  const { removeCredit } = usePendingAuthorizationsActions()
  const { updateCreditStatus, approveDocument, denyDocument } =
    useCreditActions()
  const companiesMap = useCompanies()

  const companyDomain = credit?.borrower.email.split("@")[1]
  const company = companyDomain ? companiesMap.get(companyDomain) : undefined
  const rate = company?.rate
  const duration = credit.termOffering?.term.duration
  const durationType = credit.termOffering?.term.durationType
  const loan = credit?.loan

  const amortization = useCreditAmortization({
    duration,
    durationType,
    loan: loan ?? undefined,
    rate: rate ?? undefined,
  })

  if (!credit) return null

  const handleApproveCredit = async () => {
    await updateCreditStatus(credit.id, "authorized")
    await removeCredit(credit.id)
    navigate("..")
  }

  const handleDenyCredit = async () => {
    await updateCreditStatus(credit.id, "denied")
    await removeCredit(credit.id)
    navigate("..")
  }

  const handleInvalidDocumentation = async () => {
    await updateCreditStatus(credit.id, "invalid-documentation")
    await removeCredit(credit.id)
    navigate("..")
  }

  const documentationPending =
    contractStatus === "pending" ||
    authorizationStatus === "pending" ||
    payrollReceiptStatus === "pending"

  const isAnyDocNotApproved =
    contractStatus !== "approved" ||
    authorizationStatus !== "approved" ||
    payrollReceiptStatus !== "approved"

  const areAllDocsApproved =
    contractStatus === "approved" &&
    authorizationStatus === "approved" &&
    payrollReceiptStatus === "approved"

  const isApprovedDisabled = isAnyDocNotApproved

  const isDocumentInvalidDisabled = documentationPending || areAllDocsApproved

  return (
    <div className="flex flex-col container lg:w-2/3 mx-auto px-4 py-4">
      <div className="lg:flex lg:items-center lg:justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {credit.borrower.firstName} {credit.borrower.lastName}
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
              {credit.borrower.email.split("@")[1]}
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
              {new Date(credit.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="flex gap-2">
            <Button onClick={handleApproveCredit} disabled={isApprovedDisabled}>
              <CheckIcon className="h-5 w-5 text-white mr-1.5" />
              Aprobar
            </Button>
            <Button status="secondary" onClick={handleDenyCredit}>
              <XMarkIcon className="h-5 w-5 mr-1.5" />
              Rechazar
            </Button>
            <Button
              status="secondary"
              disabled={isDocumentInvalidDisabled}
              onClick={handleInvalidDocumentation}
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
          <p className="text-gray-900 font-medium">
            {credit.borrower.employeeNumber}
          </p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">RFC</label>
          <p className="text-gray-900 font-medium">{credit.borrower.rfc}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Ingresos</label>
          <p className="text-gray-900 font-medium">
            {credit.borrower.salary
              ? MXNFormat.format(credit.borrower.salary)
              : "--"}{" "}
            MXN{" "}
            {credit.termOffering?.term?.durationType === "two-weeks"
              ? "Quincenales"
              : "Mensuales"}
          </p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            CLABE Interbancaria
          </label>
          <p className="text-gray-900 font-medium">
            {credit.borrower.bankAccountNumber}
          </p>
        </div>
        <div className="col-span-2">
          <h1 className="text-gray-900 font-bold text-xl">Crédito</h1>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Monto</label>
          <p className="text-gray-900 font-medium">
            {credit.loan ? MXNFormat.format(credit.loan) : 0}
          </p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Plazo</label>
          {credit.termOffering?.term && (
            <p className="text-gray-900 font-medium">
              {credit.termOffering.term.duration}{" "}
              {DURATION_TYPES.get(credit.termOffering.term.durationType)}
            </p>
          )}
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Empresa</label>
          <p className="text-gray-900 font-medium">{company?.name}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Taza</label>
          <p className="text-gray-900 font-medium">
            {company?.rate ? company.rate * 100 : 0}%
          </p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            Amortización
          </label>
          <p className="text-gray-900 font-medium">
            {amortization ? MXNFormat.format(amortization) : 0} Mensuales
          </p>
        </div>
        <div className="col-span-2">
          <h1 className="text-gray-900 font-bold text-xl">Documentos</h1>
        </div>
        <div className="col-span-1">
          <FileViewer
            label="Recibo de Nómina"
            fileUrl={credit.payrollReceiptUrl ?? undefined}
            fileName={credit.payrollReceiptFilename ?? undefined}
            fileDate={credit.payrollReceiptUploadedAt ?? undefined}
            fileSize={credit.payrollReceiptSize ?? undefined}
            contentType={credit.payrollReceiptContentType ?? undefined}
          >
            <Tooltip
              content={payrollReceiptRejectionReason}
              cond={payrollReceiptStatus === "rejected"}
            >
              <FileViewer.StatusButtons
                status={payrollReceiptStatus}
                onApprove={approveDocument(id, "payrollReceipt")}
                onDeny={denyDocument(id, "payrollReceipt")}
              />
            </Tooltip>
          </FileViewer>
        </div>

        <div className="col-span-1">
          <FileViewer
            label="Contrato"
            fileUrl={credit.contractUrl ?? undefined}
            fileName={credit.contractFilename ?? undefined}
            fileDate={credit.contractUploadedAt ?? undefined}
            fileSize={credit.contractSize ?? undefined}
            contentType={credit.contractContentType ?? undefined}
          >
            <Tooltip
              content={contractRejectionReason}
              cond={contractStatus === "rejected"}
            >
              <FileViewer.StatusButtons
                status={contractStatus}
                onApprove={approveDocument(id, "contract")}
                onDeny={denyDocument(id, "contract")}
              />
            </Tooltip>
          </FileViewer>
        </div>

        <div className="col-span-1">
          <FileViewer
            label="Carta de Autorización"
            fileUrl={credit.authorizationUrl ?? undefined}
            fileName={credit.authorizationFilename ?? undefined}
            fileDate={credit.authorizationUploadedAt ?? undefined}
            fileSize={credit.authorizationSize ?? undefined}
            contentType={credit.authorizationContentType ?? undefined}
          >
            <Tooltip
              content={authorizationRejectionReason}
              cond={authorizationStatus === "rejected"}
            >
              <FileViewer.StatusButtons
                status={authorizationStatus}
                onApprove={approveDocument(id, "authorization")}
                onDeny={denyDocument(id, "authorization")}
              />
            </Tooltip>
          </FileViewer>
        </div>
      </div>
    </div>
  )
}

export default ShowScreen

import { useNavigate, useParams } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { CurrencyDollarIcon, XMarkIcon } from "@heroicons/react/24/solid"

import Button from "components/atoms/button"
import FileViewer from "components/atoms/file-viewer/file-viewer"
import useCreditActions from "hooks/useCreditActions"
import useCompanies from "hooks/useCompanies"

import {
  dispersionsSelector,
  editableDispersionReceiptFieldState,
} from "./atoms"
import { useDispersionsActions } from "./actions"
import { DURATION_TYPES, HR_STATUS, MXNFormat } from "../../constants"
import { useState } from "react"
import Modal from "components/molecules/modal"
import FileField from "components/atoms/file-field"
import Tooltip from "components/atoms/tooltip"

const ShowScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  if (!id || Number.isNaN(id)) throw new Error("Missing id param")
  const credit = useRecoilValue(dispersionsSelector(id))
  if (!credit) throw new Error("Credit not found")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { removeCredit } = useDispersionsActions()
  const { updateCreditStatus } = useCreditActions()
  const companiesMap = useCompanies()
  const [dispersionReceiptId, setDispersionReceiptId] = useRecoilState(
    editableDispersionReceiptFieldState(id),
  )

  const userDomain = credit?.borrower.email.split("@")[1]
  const company = userDomain ? companiesMap.get(userDomain) : undefined

  if (!credit) return null

  const handleApproveCredit = () => {
    updateCreditStatus(credit.id, "dispersed")
    removeCredit(credit.id)
    navigate("/dashboard/dispersions")
  }

  const openDisperseModal = () => setIsModalOpen(true)

  const handleDenyCredit = () => {
    updateCreditStatus(credit.id, "denied")
    removeCredit(credit.id)
    navigate("/dashboard/dispersions")
  }

  return (
    <>
      <div className="flex flex-col container lg:w-2/3 mx-auto px-4 pt-4">
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
              <Tooltip
                content={
                  credit.dispersedAt
                    ? "El crédito ya ha sido dispersado"
                    : credit.hrStatus !== "active"
                      ? "El crédito debe estar activo para poder dispersarlo"
                      : undefined
                }
                cond={!!credit.dispersedAt || credit.hrStatus !== "active"}
              >
                <Button
                  onClick={openDisperseModal}
                  disabled={
                    credit.hrStatus !== "active" || !!credit.dispersedAt
                  }
                >
                  <CurrencyDollarIcon className="h-5 w-5 text-white mr-1.5" />
                  Dispersar
                </Button>
              </Tooltip>
              <Button
                status="secondary"
                onClick={handleDenyCredit}
                disabled={!!credit.dispersedAt}
              >
                <XMarkIcon className="h-5 w-5 mr-1.5" />
                Rechazar
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
            <label className="text-gray-500 font-medium text-sm">
              Estatus de RH
            </label>
            <p className="text-gray-900 font-medium">
              {credit.hrStatus ? HR_STATUS.get(credit.hrStatus) : "--"}
            </p>
          </div>
          <div className="col-span-1">
            <label className="text-gray-500 font-medium text-sm">RFC</label>
            <p className="text-gray-900 font-medium">{credit.borrower.rfc}</p>
          </div>
          <div className="col-span-1">
            <label className="text-gray-500 font-medium text-sm">
              Ingresos
            </label>
            <p className="text-gray-900 font-medium">
              {credit.borrower.salary
                ? MXNFormat.format(credit.borrower.salary)
                : "--"}{" "}
              MXN{" "}
              {credit?.termOffering?.term.durationType === "two-weeks"
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
                {DURATION_TYPES.get(credit.termOffering.term.durationType)}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label className="text-gray-500 font-medium text-sm">Empresa</label>
            <p className="text-gray-900 font-medium">{credit.borrower.city}</p>
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
              {credit.amortization
                ? MXNFormat.format(Number(credit.amortization))
                : 0}{" "}
              Mensuales
            </p>
          </div>
          <div className="col-span-2">
            <h1 className="text-gray-900 font-bold text-xl">Documentos</h1>
          </div>
          <div className="col-span-1">
            <FileViewer
              label="Identificación Oficial"
              fileName="Document1.pdf"
              fileDate="Sat Feb 25"
              fileSize="2.5MB"
            />
          </div>

          <div className="col-span-1">
            <FileViewer
              label="Comprobante de Domicilio"
              fileName="Document2.pdf"
              fileDate="Sat Feb 25"
              fileSize="1.9MB"
            />
          </div>

          <div className="col-span-1">
            <FileViewer
              label="Estado de Cuenta"
              fileName="Document2.pdf"
              fileDate="Sat Feb 25"
              fileSize="1.9MB"
            />
          </div>

          <div className="col-span-1">
            <FileViewer
              label="Recibo de Nómina"
              fileName="nomina.pdf"
              fileDate="Sat Feb 25"
              fileSize="1.05MB"
            />
          </div>
        </div>
      </div>
      {isModalOpen ? (
        <Modal>
          <Modal.Header
            title="Dispersar Crédito"
            onClose={() => setIsModalOpen(false)}
          />
          <Modal.Body>
            <div className="p-3">
              <FileField
                required
                id="dispersion-receipt"
                label="Recibo de dispersión"
                onRemove={() => setDispersionReceiptId(null)}
                handleFileUpload={({ signedId }) => {
                  if (!signedId) return
                  setDispersionReceiptId(signedId)
                }}
              />
            </div>
            <div className="flex gap-2 p-3">
              <Tooltip
                content="El crédito debe estar activo para poder dispersarlo"
                cond={credit.hrStatus !== "active"}
              >
                <Button
                  onClick={handleApproveCredit}
                  disabled={
                    !dispersionReceiptId || credit.hrStatus !== "active"
                  }
                >
                  Dispersar
                </Button>
              </Tooltip>
              <Button status="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      ) : null}
    </>
  )
}

export default ShowScreen

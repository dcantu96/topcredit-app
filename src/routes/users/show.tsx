import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { PencilIcon } from "@heroicons/react/24/solid"

import { userSelector } from "./atoms"
import ButtonLink from "components/atoms/button-link"
import dayjs from "dayjs"
import Chip from "components/atoms/chip"
import { CREDIT_STATUS, MXNFormat, USER_STATUSES } from "../../constants"
import FileViewer from "components/atoms/file-viewer"
import useIsRole from "hooks/useIsRole"

const ShowScreen = () => {
  const { id } = useParams()
  if (!id || Number.isNaN(id)) throw new Error("Missing id param")
  const isAdmin = useIsRole("admin")
  const user = useRecoilValue(userSelector(id))
  const status = user.status ? USER_STATUSES.get(user.status) : undefined

  return (
    <div className="flex flex-col container lg:w-2/3 mx-auto px-4 py-4">
      <div className="lg:flex lg:items-baseline lg:justify-between mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-x-2">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {user.firstName} {user.lastName}{" "}
            </h2>
            {status && <Chip status="info">{status}</Chip>}
          </div>
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
              {user.email.split("@")[1]}
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
            {isAdmin && (
              <ButtonLink to="edit">
                <PencilIcon className="h-5 w-5 text-white mr-1.5" />
                Editar
              </ButtonLink>
            )}
          </span>
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Datos Generales
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-8">
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            CLABE Interbancaria
          </label>
          <p className="text-gray-900 font-medium">{user.bankAccountNumber}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            Fecha de creación
          </label>
          <p className="text-gray-900 font-medium">
            {dayjs(user.createdAt).format()}
          </p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Correo</label>
          <p className="text-gray-900 font-medium">{user.email}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Dirección</label>
          <p className="text-gray-900 font-medium">
            {user.addressLineOne} {user.addressLineTwo} {user.city} {user.state}{" "}
            {user.country} {user.postalCode}
          </p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">
            Numero de Nómina
          </label>
          <p className="text-gray-900 font-medium">{user.employeeNumber}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Teléfono</label>
          <p className="text-gray-900 font-medium">{user.phone}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">RFC</label>
          <p className="text-gray-900 font-medium">{user.rfc}</p>
        </div>
        <div className="col-span-1">
          <label className="text-gray-500 font-medium text-sm">Salario</label>
          <p className="text-gray-900 font-medium">
            {MXNFormat.format(user.salary!)} MXN
          </p>
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2 mt-8">
        Documentación Personal
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-8">
        <div>
          <FileViewer
            label="Estado de Cuenta"
            fileDate={dayjs(user.bankStatementUploadedAt).format()}
            fileName={user.bankStatementFilename!}
            fileSize={user.bankStatementSize!}
            fileUrl={user.bankStatementUrl!}
            contentType={user.bankStatementContentType!}
          />
        </div>
        <div>
          <FileViewer
            label="Identificación"
            fileDate={dayjs(user.identityDocumentUploadedAt).format()}
            fileName={user.identityDocumentFilename!}
            fileSize={user.identityDocumentSize!}
            fileUrl={user.identityDocumentUrl!}
            contentType={user.identityDocumentContentType!}
          />
        </div>
        <div>
          <FileViewer
            label="Comprobante de Domicilio"
            fileDate={dayjs(user.proofOfAddressUploadedAt).format()}
            fileName={user.proofOfAddressFilename!}
            fileSize={user.proofOfAddressSize!}
            fileUrl={user.proofOfAddressUrl!}
            contentType={user.proofOfAddressContentType!}
          />
        </div>
        <div>
          <FileViewer
            label="Recibo de Nómina"
            fileDate={dayjs(user.payrollReceiptUploadedAt).format()}
            fileName={user.payrollReceiptFilename!}
            fileSize={user.payrollReceiptSize!}
            fileUrl={user.payrollReceiptUrl!}
            contentType={user.payrollReceiptContentType!}
          />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2 mt-8">Créditos</h3>
      {user.credits.map((credit) => (
        <div
          key={credit.id}
          className="flex items-baseline justify-between border-b border-gray-200 py-2 gap-4"
        >
          <p>
            <span className="mr-2">
              Monto: {MXNFormat.format(credit.loan!)} MXN
            </span>
            <Chip status="info">{CREDIT_STATUS.get(credit.status)}</Chip>
          </p>
          <ButtonLink size="sm" to={`/dashboard/credits/${credit.id}`}>
            Ver
          </ButtonLink>
        </div>
      ))}
    </div>
  )
}

export default ShowScreen

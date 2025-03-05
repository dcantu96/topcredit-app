import { useMemo, useState } from "react"
import { useRecoilValue } from "recoil"
import { useNavigate, useParams } from "react-router-dom"
import { CheckIcon, EyeIcon } from "@heroicons/react/24/solid"

import Button from "components/atoms/button"
import ButtonLink from "components/atoms/button-link"
import Modal from "components/molecules/modal"
import useCreditActions from "hooks/useCreditActions"

import { MXNFormat } from "../../constants"
import { hrCreditSelectorQuery } from "./atoms"
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover"
import { Button as CalendarButton } from "components/ui/button"
import { Calendar } from "components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { format } from "date-fns"
import { firstExpectedPaymentDate } from "../../utils"
import type { DurationType } from "../../schema.types"
import { companySelectorQuery } from "../companies/loader"
import { es } from "date-fns/locale/es"
import dayjs from "dayjs"

const ShowScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { creditId, id } = useParams()
  if (!creditId || Number.isNaN(creditId))
    throw new Error("Missing creditId param")
  if (!id || Number.isNaN(id)) throw new Error("Missing company id param")
  const credit = useRecoilValue(hrCreditSelectorQuery(creditId))
  const company = useRecoilValue(companySelectorQuery(id))
  if (!credit) throw new Error("Credit not found")

  if (!credit) return null

  const handleApproveCredit = () => {
    setIsModalOpen(true)
  }

  const onClose = () => {
    setIsModalOpen(false)
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
              <ButtonLink to={`/dashboard/credits/${credit.id}`}>
                <EyeIcon className="h-5 w-5 text-white mr-1.5" />
                Detalles
              </ButtonLink>
              <Button
                onClick={handleApproveCredit}
                disabled={
                  credit.status === "dispersed" ||
                  credit.hrStatus === "approved"
                }
              >
                <CheckIcon className="h-5 w-5 text-white mr-1.5" />
                Aprobar
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
            <label className="text-gray-500 font-medium text-sm">
              Ingresos
            </label>
            <p className="text-gray-900 font-medium">
              {credit.borrower.salary
                ? MXNFormat.format(credit.borrower.salary)
                : "--"}{" "}
              MXN{" "}
              {credit?.termOffering?.term.durationType === "bi-monthly"
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
                {credit.termOffering.term.durationType === "bi-monthly"
                  ? "Quincenas"
                  : "Meses"}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label className="text-gray-500 font-medium text-sm">Empresa</label>
            <p className="text-gray-900 font-medium">{company.name}</p>
          </div>
          <div className="col-span-1">
            <label className="text-gray-500 font-medium text-sm">Taza</label>
            <p className="text-gray-900 font-medium">
              {(company?.rate ? company.rate * 100 : 0).toFixed(2)}% Anual
            </p>
          </div>
          <div className="col-span-1">
            <label className="text-gray-500 font-medium text-sm">
              Descuento
            </label>
            <p className="text-gray-900 font-medium">
              {credit.amortization
                ? MXNFormat.format(Number(credit.amortization))
                : 0}{" "}
              {credit?.termOffering?.term?.durationType === "bi-monthly"
                ? "Quincenales"
                : "Mensuales"}
            </p>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ConfirmationModal
          creditId={credit.id}
          companyId={company.id}
          onClose={onClose}
          durationType={credit.termOffering!.term.durationType}
        />
      )}
    </>
  )
}

interface ConfirmationModalProps {
  creditId: string
  companyId: string
  onClose: () => void
  durationType: DurationType
}

const ConfirmationModal = ({
  creditId,
  companyId,
  onClose,
  durationType,
}: ConfirmationModalProps) => {
  const firstExpectedPayment = useMemo(
    () => firstExpectedPaymentDate(durationType),
    [durationType],
  )
  const { updateHRStatus } = useCreditActions()
  const navigate = useNavigate()

  const handleApproveCredit = () => {
    // set date to noon utc
    const firstDiscountDate = new Date(firstExpectedPayment)
    firstDiscountDate.setUTCHours(12)
    updateHRStatus(
      creditId,
      companyId,
      "approved",
      firstExpectedPayment.toISOString(),
    )
    navigate("..")
  }

  return (
    <Modal>
      <Modal.Header title="Aprobar Crédito" onClose={onClose} />
      <Modal.Body>
        <div className="p-3">
          <p className="mb-2">
            La fecha en la que se realizará el primer descuento.
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Plazo de descuento:{" "}
            {durationType === "bi-monthly" ? "Quincenal" : "Mensual"}
          </p>
          {dayjs(firstExpectedPayment).locale("es").format("LL")}
        </div>
        <div className="flex gap-2 p-3">
          <Button onClick={handleApproveCredit}>Confirmar</Button>

          <Button status="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export function ExpectedPaymentPicker({
  firstExpectedPayment,
  durationType,
  date,
  setDate,
}: {
  firstExpectedPayment: Date
  date?: Date
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  durationType: DurationType
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <CalendarButton
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: es })
          ) : (
            <span>Elige una fecha</span>
          )}
        </CalendarButton>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          fromDate={firstExpectedPayment}
          locale={es}
          disabled={[
            (date) =>
              durationType === "bi-monthly"
                ? date.getDate() !== 15 &&
                  date.getDate() !==
                    new Date(
                      date.getFullYear(),
                      date.getMonth() + 1,
                      0,
                    ).getDate()
                : date.getDate() !==
                  new Date(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    0,
                  ).getDate(),
          ]}
        />
      </PopoverContent>
    </Popover>
  )
}

export default ShowScreen

import { useNavigate } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

import List from "components/atoms/list"
import SmallDot from "components/atoms/small-dot"

import { Credit } from "src/schema.types"
import { MXNFormat } from "../../constants"
import Chip from "components/atoms/chip"
import dayjs from "dayjs"
import { useMemo } from "react"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/es"

dayjs.extend(LocalizedFormat)

const ListItem = ({
  credit,
}: {
  credit: Pick<
    Credit,
    | "id"
    | "status"
    | "updatedAt"
    | "createdAt"
    | "loan"
    | "termOffering"
    | "borrower"
    | "amortization"
    | "hrStatus"
    | "payments"
  >
}) => {
  const navigate = useNavigate()

  const lastMissingPaymentIndex = useMemo(
    () => credit.payments?.findIndex((payment) => !payment.paidAt),
    [credit.payments],
  )

  const totalMissingPayments = useMemo(
    () => credit.payments?.filter((payment) => !payment.paidAt).length,
    [credit.payments],
  )

  const lastPaidAt = useMemo(() => {
    // if there are no payments (should not happen)
    if (lastMissingPaymentIndex === undefined) return undefined
    if (lastMissingPaymentIndex === -1) {
      // if all payments are paid get the last one
      return credit.payments?.at(-1)?.paidAt
    }
    // if there are missing payments
    return credit.payments?.at(lastMissingPaymentIndex - 1)?.paidAt
  }, [credit.payments, lastMissingPaymentIndex])

  console.log({ lastPaidAt })

  // set last paid at or a text saying waiting for first payment
  const lastPaidAtText = lastPaidAt
    ? `Último descuento ${dayjs(lastPaidAt).locale("es").format("LL")}`
    : "Esperando primer descuento"

  return (
    <List.Item>
      <div className="flex-1 min-w-56">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 items-center leading-6 font-semibold text-sm min-w-0 flex text-inherit decoration-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {credit.borrower.firstName} {credit.borrower.lastName}
            </span>
            <Chip
              status={
                credit.status === "dispersed"
                  ? "success"
                  : credit.hrStatus
                    ? "info"
                    : "error"
              }
            >
              {credit.status === "dispersed"
                ? "Activo"
                : credit.hrStatus
                  ? "Aprobado por RH"
                  : "Pendiente"}
            </Chip>
            <span className="hidden md:block">
              <SmallDot />
            </span>
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap hidden md:block">
              {credit.borrower.phone}
            </span>
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-500">
          <p className="whitespace-nowrap">{lastPaidAtText}</p>
          <span className="hidden md:block">
            <SmallDot />
          </span>
          <p className="whitespace-nowrap font-semibold hidden md:block">
            Préstamo {credit.loan ? MXNFormat.format(credit.loan) : 0}
          </p>
        </div>
      </div>
      <div className="min-w-32 self-end">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 items-center leading-6 font-medium text-sm min-w-0 flex text-inherit decoration-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {totalMissingPayments} descuentos pendientes
            </span>
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-500">
          <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
            Descuento <b>{MXNFormat.format(credit.amortization!)}</b>
          </span>
        </div>
      </div>
      <button
        onClick={() => navigate(credit.id)}
        className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
      </button>
    </List.Item>
  )
}

export default ListItem

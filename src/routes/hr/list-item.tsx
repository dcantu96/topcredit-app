import { useNavigate } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

import List from "components/atoms/list"
import SmallDot from "components/atoms/small-dot"

import { MXNFormat } from "../../constants"
import Chip from "components/atoms/chip"
import dayjs from "dayjs"
import { useMemo } from "react"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import { ActiveCredit } from "./atoms"
import "dayjs/locale/es"
import { nextExpectedPaymentDate } from "../../utils"

dayjs.extend(LocalizedFormat)

const ListItem = ({ credit }: { credit: ActiveCredit }) => {
  const navigate = useNavigate()
  const nextExpectedPayment = useMemo(
    () => nextExpectedPaymentDate(credit.termOffering!.term.durationType),
    [credit.termOffering],
  )

  const lastMissingPaymentIndex = useMemo(
    () => credit.payments.findIndex((payment) => !payment.paidAt),
    [credit.payments],
  )

  const lastPaidAt = useMemo(() => {
    // if there are no payments (should not happen)
    if (lastMissingPaymentIndex === undefined) return undefined
    if (lastMissingPaymentIndex === -1) {
      // if all payments are paid get the last one
      return credit.payments.at(-1)?.paidAt
    }
    // if there are missing payments
    return credit.payments.at(lastMissingPaymentIndex - 1)?.paidAt
  }, [credit.payments, lastMissingPaymentIndex])

  const delayedPayments = useMemo(
    () =>
      credit.payments.filter(
        (payment) =>
          !!payment.expectedAt &&
          new Date(payment.expectedAt) < new Date() &&
          !payment.paidAt,
      ),
    [credit.payments],
  )

  const nextPayment = useMemo(() => {
    const next = credit.payments
      .toSorted((a, b) => a.number - b.number)
      .find(
        (payment) =>
          new Date(payment.expectedAt) > new Date() && !payment.paidAt,
      )
    if (!next) throw new Error("Next payment not found")
    return next
  }, [credit.payments])

  const incomingPayments = useMemo(() => {
    const paymentNumbers = new Set<number>()
    for (const payment of delayedPayments) {
      paymentNumbers.add(payment.number)
    }
    paymentNumbers.add(nextPayment.number)
    return paymentNumbers
  }, [delayedPayments, nextPayment])

  // set last paid at or a text saying waiting for first payment
  const lastPaidAtText = delayedPayments.length
    ? lastPaidAt
      ? `Último descuento ${dayjs(lastPaidAt).locale("es").format("LL")}`
      : "Esperando primer descuento"
    : `Proximo descuento ${dayjs(nextPayment.expectedAt).locale("es").format("LL")}`

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
                  ? delayedPayments.length > 0
                    ? "error"
                    : dayjs(nextPayment.expectedAt).isAfter(
                          dayjs(nextExpectedPayment),
                          "hour",
                        )
                      ? "success"
                      : "warning"
                  : credit.hrStatus
                    ? "info"
                    : "error"
              }
            >
              {credit.status === "dispersed"
                ? delayedPayments.length > 0
                  ? "Tarde"
                  : dayjs(nextPayment.expectedAt).isAfter(
                        dayjs(nextExpectedPayment),
                        "hour",
                      )
                    ? "Al corriente"
                    : "Esperando próximo pago"
                : credit.hrStatus
                  ? "Aprobado por RH"
                  : "Pendiente"}
            </Chip>
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap hidden md:block">
              {credit.borrower.phone}
            </span>
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-500">
          <p className="whitespace-nowrap">{lastPaidAtText}</p>
          {delayedPayments.length ? (
            <>
              <span className="hidden md:block">
                <SmallDot />
              </span>
              <p className="whitespace-nowrap font-semibold hidden md:block">
                {`${delayedPayments.length} descuentos retrasados`}
              </p>
            </>
          ) : null}
        </div>
      </div>
      <div className="min-w-32 self-end">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 items-center leading-6 font-medium text-sm min-w-0 flex text-inherit decoration-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              Préstamo {credit.loan ? MXNFormat.format(credit.loan) : 0}
            </span>
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-500">
          <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
            Descuento #{Array.from(incomingPayments).join(", ")}{" "}
            <b>
              {MXNFormat.format(
                Number(credit.amortization) * (delayedPayments.length + 1),
              )}
            </b>
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

import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/es"

import List from "components/atoms/list"
import Chip from "components/atoms/chip"

import { MXNFormat } from "../../constants"
import { creditPressed, type ActiveCredit } from "./atoms"
import { useRecoilState } from "recoil"
import { useMemo } from "react"

dayjs.extend(LocalizedFormat)

const ListItem = ({ credit }: { credit: ActiveCredit }) => {
  const [pressed, setPressed] = useRecoilState(creditPressed(credit.id))
  const lastPayment = credit.payments
    .toSorted((a, b) => a.number - b.number)
    .findLast((payment) => !!payment.paidAt)

  const nextPayment = credit.payments.find((payment) => !payment.paidAt)

  const delayedPayments = useMemo(
    () =>
      credit.payments.filter(
        (payment) =>
          !!payment.expectedAt &&
          new Date(payment.expectedAt) < new Date() &&
          !payment.paidAt &&
          !payment.hrConfirmedAt,
      ).length,
    [credit.payments],
  )

  return (
    <List.Item>
      <div className="flex-1 min-w-56">
        <div className="flex items-center gap-x-3">
          <label htmlFor={credit.id}>
            <div className="flex group active:ring-2 ring-black rounded">
              <input
                tabIndex={0}
                id={credit.id}
                type="checkbox"
                disabled={!!nextPayment?.hrConfirmedAt}
                checked={pressed}
                onChange={() => setPressed(!pressed)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPressed(!pressed)
                  }
                }}
                className="rounded h-4 w-4 cursor-pointer bg-white border-indigo-300 text-indigo-600 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400"
              />
            </div>
          </label>
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0 inline-flex gap-x-2">
            <label
              htmlFor={credit.id}
              className="cursor-pointer hover:text-gray-700 overflow-ellipsis overflow-hidden whitespace-nowrap"
            >
              {credit.borrower.firstName} {credit.borrower.lastName}
            </label>
            <Chip status={delayedPayments > 0 ? "error" : "success"}>
              {delayedPayments > 0 ? "Tarde" : "Activo"}
            </Chip>
            {!!nextPayment?.hrConfirmedAt && (
              <Chip status="info">Aprobado por RH</Chip>
            )}
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
          <p
            className={`whitespace-nowrap ${delayedPayments === 0 ? "" : "text-red-600"}`}
          >
            {lastPayment?.paidAt ? (
              <>
                Último descuento{" "}
                <b>{dayjs(lastPayment.paidAt).locale("es").format("LL")}</b>
              </>
            ) : (
              "Sin pagos"
            )}
          </p>
        </div>
      </div>
      <div className="min-w-32 self-end">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 items-center leading-6 font-medium text-sm min-w-0 flex text-inherit decoration-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {delayedPayments
                ? `${delayedPayments} descuentos pendientes`
                : "Al corriente"}
            </span>
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-500">
          <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
            Próximo descuento #{nextPayment?.number}{" "}
            <b>{MXNFormat.format(credit.amortization!)}</b>
          </span>
        </div>
      </div>
    </List.Item>
  )
}

export default ListItem

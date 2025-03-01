import List from "components/atoms/list"
import { useMemo } from "react"
import Chip from "components/atoms/chip"
import { useRecoilState } from "recoil"
import { installedCreditWithPaymentSelectedState } from "./atoms"
import { MXNFormat } from "../../constants"
import { ChevronRightIcon } from "@heroicons/react/16/solid"
import { useNavigate } from "react-router-dom"
import { CompanyCreditDetailed } from "../../services/companies/atoms"
import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/es"
dayjs.extend(LocalizedFormat)

const ListItem = ({ credit }: { credit: CompanyCreditDetailed }) => {
  const navigate = useNavigate()
  const [pressed, setPressed] = useRecoilState(
    installedCreditWithPaymentSelectedState(credit.id),
  )

  const delayedPayments = useMemo(() => {
    return credit.payments.filter(
      (payment) =>
        !payment.paidAt && dayjs(payment.expectedAt).isBefore(dayjs()),
    ).length
  }, [credit.payments])

  const status = useMemo(() => {
    if (delayedPayments > 0) {
      return "delayed"
    }
    return "pending"
  }, [delayedPayments])

  const lastPayment = credit.payments.findLast(
    (payment) => !!payment.paidAt,
  )?.paidAt

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
                checked={pressed}
                onChange={() => setPressed(!pressed)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPressed(!pressed)
                  }
                }}
                className="rounded h-4 w-4 cursor-pointer bg-white border-indigo-300 text-indigo-600 focus:ring-indigo-200"
              />
            </div>
          </label>
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0 inline-flex">
            <label
              htmlFor={credit.id}
              className="cursor-pointer hover:text-gray-700 mr-2"
            >
              <a className="flex text-inherit decoration-inherit gap-x-2">
                <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  {credit.borrower.firstName} {credit.borrower.lastName} ·{" "}
                  {credit.borrower.employeeNumber}
                </span>
              </a>
            </label>
            <Chip status={status === "delayed" ? "error" : "info"}>
              {status === "delayed" ? "Demorado" : "Al Corriente"}
            </Chip>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
          <p
            className={`whitespace-nowrap ${status === "pending" ? "" : "text-red-600"}`}
          >
            {lastPayment ? (
              <>
                Último descuento{" "}
                <b>{dayjs(lastPayment).locale("es").format("LL")}</b>
              </>
            ) : (
              "Sin pagos"
            )}
          </p>
        </div>
      </div>
      {delayedPayments > 0 && (
        <div className="min-w-28">
          <div className="flex items-center gap-x-3">
            <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
              <a className="flex text-inherit decoration-inherit gap-x-2">
                <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  Demorados
                </span>
              </a>
            </h2>
          </div>
          <p className="whitespace-nowrap text-sm mt-3">
            {delayedPayments} descuento(s)
          </p>
        </div>
      )}
      <div className="min-w-28">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Descuento
              </span>
            </a>
          </h2>
        </div>
        <p className="whitespace-nowrap text-sm mt-3">
          {credit.amortization
            ? MXNFormat.format(Number(credit.amortization))
            : 0}{" "}
          MXN
        </p>
      </div>
      <button
        onClick={() => navigate("/dashboard/credits/" + credit.id)}
        className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
      </button>
    </List.Item>
  )
}

export default ListItem

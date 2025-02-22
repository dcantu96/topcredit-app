import List from "components/atoms/list"
import { useMemo } from "react"
import Chip from "components/atoms/chip"
import { useRecoilState } from "recoil"
import { installedCreditWithPaymentSelectedState } from "./atoms"
import { MXNFormat } from "../../constants"
import SmallDot from "components/atoms/small-dot"
import { ChevronRightIcon } from "@heroicons/react/16/solid"
import { useNavigate } from "react-router-dom"
import { CompanyCreditDetailed } from "../../services/companies/atoms"
import dayjs from "dayjs"

const ListItem = ({
  credit,
  employeeSalaryFrequency,
}: {
  credit: CompanyCreditDetailed
  employeeSalaryFrequency: "bi-monthly" | "monthly"
}) => {
  const navigate = useNavigate()
  const [pressed, setPressed] = useRecoilState(
    installedCreditWithPaymentSelectedState(credit.id),
  )

  const delayedPayment = useMemo(() => {
    return !!credit.payments.find(
      (payment) =>
        !payment.paidAt && dayjs(payment.expectedAt).isBefore(dayjs()),
    )
  }, [credit.payments])

  const status = useMemo(() => {
    if (delayedPayment) {
      return "delayed"
    }
    return "pending"
  }, [delayedPayment])

  const lastPayment = credit.payments.at(-1)?.paidAt

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
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <label
              htmlFor={credit.id}
              className="cursor-pointer hover:text-gray-700"
            >
              <a className="flex text-inherit decoration-inherit gap-x-2">
                <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  {credit.borrower.firstName} {credit.borrower.lastName} ·{" "}
                  {credit.borrower.employeeNumber}
                </span>
                <span className="text-gray-400">/</span>
                <span className="whitespace-nowrap">
                  {credit.payments.length} de{" "}
                  {credit.termOffering.term.duration} pagos
                </span>
              </a>
            </label>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
          <p className="whitespace-nowrap">
            Instalado el{" "}
            <b>
              {credit.firstDiscountDate
                ? new Date(credit.firstDiscountDate).toLocaleDateString()
                : ""}
            </b>
          </p>
          <SmallDot />
          <p
            className={`whitespace-nowrap ${status === "pending" ? "" : "text-red-600"}`}
          >
            {lastPayment ? (
              <>
                Ultimo pago <b>{new Date(lastPayment).toLocaleDateString()}</b>
              </>
            ) : (
              "Sin pagos"
            )}
          </p>
        </div>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Descuento{" "}
                {employeeSalaryFrequency === "bi-monthly"
                  ? "Quincenal"
                  : "Mensual"}
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
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Estatus
              </span>
            </a>
          </h2>
        </div>
        <Chip status={status === "delayed" ? "error" : "info"}>
          {status === "delayed" ? "Demorado" : "Activo"}
        </Chip>
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

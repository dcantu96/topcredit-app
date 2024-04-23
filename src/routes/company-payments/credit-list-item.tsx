import List from "components/atoms/list"
import type { CompanyCreditDetailed } from "./atoms"
import { useMemo } from "react"
import Chip from "components/atoms/chip"
import { useRecoilState } from "recoil"
import { installedCreditWithPaymentSelectedState } from "./atoms"
import { MXNFormat } from "../../constants"
import SmallDot from "components/atoms/small-dot"
import { hasDelayedPayment } from "../company-installations/utils"
import useCreditAmortization from "hooks/useCreditAmortization"
import { ChevronRightIcon } from "@heroicons/react/16/solid"
import { useNavigate } from "react-router-dom"

const ListItem = ({
  credit,
  employeeSalaryFrequency,
  termDuration,
}: {
  credit: CompanyCreditDetailed
  employeeSalaryFrequency: "biweekly" | "monthly"
  termDuration: number
}) => {
  const navigate = useNavigate()
  const [pressed, setPressed] = useRecoilState(
    installedCreditWithPaymentSelectedState(credit.id),
  )
  const status = useMemo(() => {
    if (hasDelayedPayment(credit, employeeSalaryFrequency, termDuration)) {
      return "delayed"
    }
    return "pending"
  }, [credit, employeeSalaryFrequency, termDuration])

  const amortization = useCreditAmortization({
    duration: credit.termOffering.term.duration,
    durationType: credit.termOffering.term.durationType,
    loan: credit.loan!,
    rate: credit.termOffering.company.rate,
  })

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
                  console.log(e.key)
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
                  {credit.borrower.firstName} {credit.borrower.lastName}
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
              {credit.installationDate
                ? new Date(credit.installationDate).toLocaleDateString()
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
                {employeeSalaryFrequency === "biweekly"
                  ? "Quincenal"
                  : "Mensual"}
              </span>
            </a>
          </h2>
        </div>
        <p className="whitespace-nowrap text-sm mt-3">
          {amortization ? MXNFormat.format(amortization) : 0} MXN
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

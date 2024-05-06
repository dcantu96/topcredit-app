import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { ChevronRightIcon } from "@heroicons/react/16/solid"

import List from "components/atoms/list"
import { MXNFormat } from "../../constants"

import { completedCreditSelectedState } from "./atoms"
import { CompanyCreditDetailed } from "../../services/companies/atoms"
import { Payment } from "src/schema.types"

const ListItem = ({ credit }: { credit: CompanyCreditDetailed }) => {
  const navigate = useNavigate()
  const [pressed, setPressed] = useRecoilState(
    completedCreditSelectedState(credit.id),
  )

  const lastPayment = credit.payments.at(-1)?.paidAt

  const termDuration = credit.termOffering.term.duration
  const creditPayments: (
    | Pick<Payment, "number" | "id" | "paidAt" | "amount">
    | undefined
  )[] = []

  for (let i = 0; i < termDuration; i++) {
    const payment = credit.payments.find((payment) => payment.number === i + 1)
    creditPayments.push(payment)
  }

  const totalPaid = credit.payments.reduce(
    (acc, payment) => acc + payment.amount,
    0,
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
            Ultimo pago <b>{new Date(lastPayment!).toLocaleDateString()}</b>
          </p>
        </div>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-600 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Crédito
              </span>
            </a>
          </h2>
        </div>
        <p className="whitespace-nowrap mt-2 font-semibold text-sm">
          {MXNFormat.format(credit.loan!)} MXN
        </p>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-600 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Total Pagado
              </span>
            </a>
          </h2>
        </div>
        <p className="whitespace-nowrap mt-2 font-semibold text-sm">
          {MXNFormat.format(totalPaid)} MXN
        </p>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-600 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Total a Pagar
              </span>
            </a>
          </h2>
        </div>
        <p className="whitespace-nowrap mt-2 font-semibold text-sm">
          {MXNFormat.format((Number(credit.amortization) ?? 0) * termDuration)}{" "}
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

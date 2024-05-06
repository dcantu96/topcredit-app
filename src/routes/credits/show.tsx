import { useRecoilValue } from "recoil"
import { useParams } from "react-router-dom"

import NavLink from "components/atoms/nav-link"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import ListItem from "./list-item"
import { fetchNextPayrollDate } from "../company-installations/utils"
import { creditDetailedWithPaymentsState } from "./atoms"
import { Payment } from "src/schema.types"
import { MXNFormat } from "../../constants"

const Screen = () => {
  const { id } = useParams()
  const credit = useRecoilValue(creditDetailedWithPaymentsState(id!))
  const company = credit.termOffering.company
  const nextPayrollDate = fetchNextPayrollDate(
    credit.termOffering.company.employeeSalaryFrequency,
  ).toLocaleDateString()
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
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Cobranza" to={"/dashboard/payments"}>
            /{" "}
            <ListHeader.Title
              text={company.name}
              to={`/dashboard/payments/${company.id}`}
            >
              / <ListHeader.Title text={credit.borrower.firstName!} />
            </ListHeader.Title>
          </ListHeader.Title>
          <ListHeader.Actions>
            <h3 className="text-sm">
              Proxima Nómina <b>{nextPayrollDate}</b>
            </h3>
          </ListHeader.Actions>
        </ListHeader>
        <List>
          <List.Item>
            <div className="min-w-32">
              <div className="flex items-center gap-x-3">
                <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                  <a className="flex text-inherit decoration-inherit gap-x-2">
                    <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                      Préstamo
                    </span>
                  </a>
                </h2>
              </div>
              <p className="whitespace-nowrap mt-2 font-semibold">
                {MXNFormat.format(credit.loan!)} MXN
              </p>
            </div>
            <div className="min-w-32">
              <div className="flex items-center gap-x-3">
                <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                  <a className="flex text-inherit decoration-inherit gap-x-2">
                    <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                      Crédito
                    </span>
                  </a>
                </h2>
              </div>
              <p className="whitespace-nowrap mt-2 font-semibold">
                {MXNFormat.format(Number(credit.creditAmount) ?? 0)} MXN
              </p>
            </div>
            <div className="min-w-32">
              <div className="flex items-center gap-x-3">
                <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                  <a className="flex text-inherit decoration-inherit gap-x-2">
                    <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                      Plazo
                    </span>
                  </a>
                </h2>
              </div>
              <p className="whitespace-nowrap mt-2 font-semibold">
                {termDuration}{" "}
                {credit.termOffering.term.durationType === "two-weeks"
                  ? "Quincenas"
                  : "Meses"}
              </p>
            </div>
            <div className="min-w-32">
              <div className="flex items-center gap-x-3">
                <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                  <a className="flex text-inherit decoration-inherit gap-x-2">
                    <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                      Total Pagado
                    </span>
                  </a>
                </h2>
              </div>
              <p className="whitespace-nowrap mt-2 font-semibold">
                {MXNFormat.format(totalPaid)} MXN
              </p>
            </div>
            <div className="min-w-32">
              <div className="flex items-center gap-x-3">
                <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                  <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                    Amortización
                  </span>
                </h2>
              </div>
              <p className="whitespace-nowrap mt-2 font-semibold">
                {credit.amortization
                  ? MXNFormat.format(Number(credit.amortization))
                  : 0}{" "}
                MXN
              </p>
            </div>
          </List.Item>
          {creditPayments.map((maybePayment, index) => (
            <ListItem
              key={index}
              number={index + 1}
              payment={maybePayment}
              installationDate={credit.installationDate!}
              employeeSalaryFrequency={company.employeeSalaryFrequency}
              amortization={Number(credit.amortization)!}
            />
          ))}
        </List>
      </ListContainer>
      {/* activity */}
      <aside className="bg-slate-50 lg:border-gray-900/10 lg:border-l w-full lg:w-96 lg:top-16 lg:h-full h-fit">
        <header className="py-4 px-4 sm:px-6 lg:px-8 min-h-[70px] border-gray-900/10 border-b flex items-center">
          <div className="flex items-baseline justify-between flex-1">
            <h2 className="text-gray-900 leading-7 font-semibold text-base">
              Actividad
            </h2>
            <NavLink to="/pre-authorizations">Ver todo</NavLink>
          </div>
        </header>
      </aside>
    </>
  )
}

export default Screen

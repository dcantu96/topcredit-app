import dayjs from "dayjs"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"

import {
  companyInstalledCreditsQuery,
  companyDispersedCreditsQuery,
  companyPaymentFiltersState,
  companyPaymentsQuery,
  companySelectorQuery,
  companyNewlyInstalledCreditsQuery,
} from "./loader"

import { MXNFormat } from "../../constants"
import {
  fetchLastPayrollDate,
  fetchNextPayrollDate,
} from "../company-installations/utils"

import { myProfileState } from "components/providers/auth/atoms"
import Table from "components/molecules/table"
import Cell from "components/atoms/cell"
import { eventsSelector } from "components/organisms/activity-container/atoms"
import "dayjs/locale/es"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const ShowCompany = () => {
  const { id } = useParams()
  if (!id) throw new Error("Missing id param")
  const [filters, setFilters] = useRecoilState(companyPaymentFiltersState)
  const user = useRecoilValue(myProfileState)
  if (!user?.roles.includes("admin") && Number(id) !== user?.hrCompanyId)
    throw new Error("Unauthorized")
  const { employeeSalaryFrequency } = useRecoilValue(companySelectorQuery(id))

  const payments = useRecoilValue(companyPaymentsQuery(id))
  const total = payments.reduce((acc, payment) => acc + payment.amount, 0)
  const newlyInstalledCredits = useRecoilValue(
    companyNewlyInstalledCreditsQuery(id),
  )
  const installedCredits = useRecoilValue(companyInstalledCreditsQuery(id))
  const nextPayrollDate = useMemo(() => {
    // check selected filter range and calculate next payroll date
    // last-7-days will check based on the upcoming payroll date
    // the rest will check based on the last payroll date

    if (filters.range === "last-7-days") {
      return fetchNextPayrollDate(employeeSalaryFrequency)
    }
    return fetchLastPayrollDate(employeeSalaryFrequency)
  }, [employeeSalaryFrequency, filters.range])
  const dispersedCredits = useRecoilValue(companyDispersedCreditsQuery(id))
  const totalCredits = dispersedCredits.reduce(
    (acc, { creditAmount = 0 }) => acc + Number(creditAmount),
    0,
  )
  const incomingPayments = installedCredits.reduce(
    (acc, { amortization = 0, nextExpectedPayment }) => {
      console.log({ nextExpectedPayment, nextPayrollDate })
      if (
        nextExpectedPayment &&
        dayjs(nextExpectedPayment).isBefore(nextPayrollDate)
      )
        return acc + Number(amortization)
      else return acc
    },
    0,
  )

  console.log({ payments, incomingPayments })
  return (
    <div className="flex w-full flex-col">
      <header className="pt-6 pb-4 sm:pb-6">
        <div className="px-4 gap-6 items-center flex-wrap max-w-7xl flex mx-auto md:flex-nowrap md:px-6 lg:px-8">
          <h1 className="text-gray-900 text-base leading-7 font-semibold whitespace-nowrap">
            Cashflow {dayjs(nextPayrollDate).format("DD/MM/YYYY")}
          </h1>
          <div className="leading-6 font-semibold text-sm gap-8 w-full flex md:w-auto md:border-l md:border-gray-200 md:pl-6 md:leading-7 mr-auto">
            <button
              type="button"
              onMouseDown={() => setFilters({ range: "last-7-days" })}
              className={`${filters.range === "last-7-days" ? "text-indigo-600" : "text-gray-700"} hover:text-indigo-600`}
            >
              Últimos 7 días
            </button>
            <button
              type="button"
              onMouseDown={() => setFilters({ range: "last-payment" })}
              className={`${filters.range === "last-payment" ? "text-indigo-600" : "text-gray-700"} hover:text-indigo-600`}
            >
              Última Quincena
            </button>
            <button
              type="button"
              onMouseDown={() => setFilters({ range: "last-2-payments" })}
              className={`${filters.range === "last-2-payments" ? "text-indigo-600" : "text-gray-700"} hover:text-indigo-600`}
            >
              Último Mes
            </button>
            <button
              type="button"
              onMouseDown={() => setFilters({ range: "last-4-payments" })}
              className={`${filters.range === "last-4-payments" ? "text-indigo-600" : "text-gray-700"} hover:text-indigo-600`}
            >
              2 Meses
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-gray-900/10 lg:border-t border-t-gray-900/5">
        <dl className="grid mx-auto max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Total Cobrado
            </dt>
            <dd className="text-xs font-medium text-gray-500">+4.75%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              {MXNFormat.format(total)}
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 sm:border-l border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              {filters.range === "last-7-days"
                ? "Pendiente Por Cobrar"
                : "Faltante"}
            </dt>
            <dd className="text-xs font-medium text-gray-500">+54.02%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              {MXNFormat.format(incomingPayments)}
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 border-t lg:border-l lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Dispersiones Totales
            </dt>
            <dd className="text-xs font-medium text-gray-500">-1.39%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              {MXNFormat.format(totalCredits)}
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 sm:border-l border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Cartera Vencida
            </dt>
            <dd className="text-xs font-medium text-gray-500">+10.18%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-red-600">
              $30,156.00
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 sm:border-l border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Créditos Instalados
            </dt>
            <dd className="text-xs font-medium text-gray-500">+10.18%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              {newlyInstalledCredits.length}
            </dd>
          </div>
        </dl>
      </div>

      <EntireTable />
    </div>
  )
}

const EntireTable = () => {
  const notifications = useRecoilValue(
    eventsSelector([
      "AuthorizedCredit",
      "DeniedCredit",
      "DispersedCredit",
      "InstalledCredit",
      "InvalidDocumentationCredit",
      "PendingCredit",
    ]),
  )
  return (
    <div className="pt-16">
      <div>
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="lg:max-w-none lg:mx-0 text-gray-900 font-semibold text-base max-w-2xl mx-auto">
            Actividad Reciente
          </h2>
        </div>
        <Table>
          <Table.ScreenReader>
            <Table.ScreenReader.Header>Message</Table.ScreenReader.Header>
          </Table.ScreenReader>
          <Table.Body>
            <Table.Divider span={3}>Hoy</Table.Divider>
            {notifications.map((notification) => (
              <Table.Row key={notification.id}>
                <Cell>
                  <Cell.Data>
                    <Cell.Data.Title>
                      <Cell.Data.Text>{notification.message}</Cell.Data.Text>
                    </Cell.Data.Title>
                    <Cell.Data.Subtitle>
                      {dayjs(notification.createdAt).locale("es").fromNow()}
                    </Cell.Data.Subtitle>
                  </Cell.Data>
                </Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default ShowCompany

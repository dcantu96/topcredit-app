import { useRecoilValue } from "recoil"
import {
  userGeneralDataQuerySelector,
  userLatestAuthorizedCreditSelectorQuery,
} from "../new-credit/atoms"
import DashboardHeader from "components/organisms/dashboard-header"
import List from "components/organisms/list"
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import { DURATION_TYPES, MXNFormat } from "../../constants"
import {
  readonlyIdentityDocumentSelector,
  readonlyBankStatementSelector,
  readonlyPayrollReceiptSelector,
  readonlyProofOfAddressSelector,
} from "../new-credit/components/steps/general-data/atoms"
import dayjs from "dayjs"
import { useMemo } from "react"
import {
  fetchNextPayrollDate,
  getNextPaymentDate,
} from "../company-installations/utils"
import { ClockIcon } from "@heroicons/react/16/solid"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/es"
dayjs.extend(relativeTime)

interface AmortizedTable {
  amount: number
  paidAt?: string
  expectedPaidAt: string
  number: number
}

const MyCredits = () => {
  const credit = useRecoilValue(userLatestAuthorizedCreditSelectorQuery)
  const user = useRecoilValue(userGeneralDataQuerySelector)
  const identityDocument = useRecoilValue(readonlyIdentityDocumentSelector)
  const bankStatement = useRecoilValue(readonlyBankStatementSelector)
  const payrollReceipt = useRecoilValue(readonlyPayrollReceiptSelector)
  const proofOfAddress = useRecoilValue(readonlyProofOfAddressSelector)

  const frequency =
    credit?.termOffering.term.durationType === "months" ? "monthly" : "biweekly"
  const nextPayrollDate = fetchNextPayrollDate(
    frequency,
    credit?.installationDate ?? undefined,
  )

  const amortizedTable = useMemo(() => {
    if (!credit) return []
    const list: AmortizedTable[] = []

    for (let i = 0; i < credit.termOffering.term.duration; i++) {
      const payment = credit.payments?.find(
        (payment) => payment.number === i + 1,
      )
      const prevExpectedPaidAt = list.at(i - 1)?.expectedPaidAt
      const prevExpectedPaidAtDate = prevExpectedPaidAt
        ? new Date(prevExpectedPaidAt)
        : nextPayrollDate
      list.push({
        amount: payment?.amount ?? Number(credit.amortization),
        expectedPaidAt: getNextPaymentDate(
          prevExpectedPaidAtDate,
          frequency,
        ).toISOString(),
        paidAt: payment?.paidAt,
        number: i + 1,
      })
    }
    return list
  }, [credit, nextPayrollDate, frequency])
  return (
    <div className="flex flex-col h-screen grid-rows-[60px_1fr]">
      <div className="w-full">
        <DashboardHeader />
      </div>
      <header className="bg-white mt-14">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Vida del Crédito
          </h1>
        </div>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 sm:px-6 lg:px-8 gap-4">
        <div className="shadow bg-white rounded p-4 ring-1 ring-inset">
          <h4 className="text-base font-semibold">Próximo Pago</h4>
          <p className="text-gray-500">
            {dayjs(nextPayrollDate).locale("es").from(dayjs())}
          </p>
        </div>
        <div className="shadow bg-white rounded p-4 ring-1 ring-inset">
          <h4 className="text-base font-semibold">Crédito</h4>
          <p className="text-gray-500">
            {credit?.loan ? MXNFormat.format(credit.loan) : 0} MXN
          </p>
        </div>
        <div className="shadow bg-white rounded p-4 ring-1 ring-inset">
          <h4 className="text-base font-semibold">Plazo</h4>
          <p className="text-gray-500">
            {credit?.termOffering.term.duration}{" "}
            {credit?.termOffering.term.durationType
              ? DURATION_TYPES.get(credit?.termOffering.term.durationType)
              : ""}
          </p>
        </div>
        <div className="shadow bg-white rounded p-4 ring-1 ring-inset">
          <h4 className="text-base font-semibold">Amortización</h4>
          <p className="text-gray-500">
            {credit?.amortization
              ? MXNFormat.format(Number(credit.amortization))
              : 0}{" "}
            MXN
          </p>
        </div>

        <div className="col-span-full px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Tabla de Amortización
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Aquí podrás ver los pagos que tenemos registrados.
          </p>
        </div>

        <div className="col-span-full">
          <List>
            <List.Header
              columns={[
                "Monto",
                "Fecha Programada",
                "Fecha de Pago",
                "Estatus",
              ]}
            />
            <List.Body>
              {amortizedTable?.map((payment) => (
                <List.Row key={payment.number}>
                  <List.Cell>{payment.amount} MXN</List.Cell>
                  <List.Cell>
                    {dayjs(payment.expectedPaidAt).format("DD/MM/YYYY")}
                  </List.Cell>
                  <List.Cell>
                    {payment.paidAt
                      ? dayjs(payment.paidAt).format("DD/MM/YYYY")
                      : "--"}
                  </List.Cell>
                  <List.Cell>
                    {payment.paidAt ? (
                      dayjs(payment.paidAt).isAfter(payment.expectedPaidAt) ? (
                        <>
                          <ExclamationTriangleIcon className="mr-2 w-6 h-6 text-red-500" />
                          Pagado Demorado
                        </>
                      ) : dayjs(payment.paidAt).isBefore(
                          payment.expectedPaidAt,
                        ) ? (
                        <>
                          <CheckBadgeIcon className="mr-2 w-6 h-6 text-green-500" />
                          Pagado Adelantado
                        </>
                      ) : (
                        <>
                          <CheckBadgeIcon className="mr-2 w-6 h-6 text-blue-500" />
                          Pagado
                        </>
                      )
                    ) : dayjs().isAfter(payment.expectedPaidAt) ? (
                      <>
                        <ExclamationTriangleIcon className="mr-2 w-6 h-6 text-red-500" />
                        Pago Atrasado
                      </>
                    ) : (
                      <>
                        <ClockIcon className="mr-2 w-6 h-6 text-gray-500" />
                        Pendiente de Pago
                      </>
                    )}
                  </List.Cell>
                </List.Row>
              ))}
            </List.Body>
          </List>
        </div>

        <div className="col-span-full">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Tu Información
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Datos personales y sobre el crédito.
            </p>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Nombre completo
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {user?.firstName} {user?.lastName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Correo Electrónico
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {user?.email}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Dirección
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {user?.addressLineOne} {user?.addressLineTwo} {user?.city}{" "}
                  {user?.state} {user?.country} {user?.postalCode}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  CLABE Interbancaria
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {user?.bankAccountNumber}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Teléfono
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {user?.phone}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Documentos
                </dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    {identityDocument && (
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <svg
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {identityDocument.filename}
                            </span>
                            <span className="flex-shrink-0 text-gray-400">
                              {identityDocument.size}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div
                            onClick={() =>
                              window.open(identityDocument.url, "_blank")
                            }
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Download
                          </div>
                        </div>
                      </li>
                    )}
                    {bankStatement && (
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <svg
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {bankStatement.filename}
                            </span>
                            <span className="flex-shrink-0 text-gray-400">
                              {bankStatement.size}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div
                            onClick={() =>
                              window.open(bankStatement.url, "_blank")
                            }
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Download
                          </div>
                        </div>
                      </li>
                    )}
                    {payrollReceipt && (
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <svg
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {payrollReceipt.filename}
                            </span>
                            <span className="flex-shrink-0 text-gray-400">
                              {payrollReceipt.size}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div
                            onClick={() =>
                              window.open(payrollReceipt.url, "_blank")
                            }
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Download
                          </div>
                        </div>
                      </li>
                    )}
                    {proofOfAddress && (
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <svg
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {proofOfAddress.filename}
                            </span>
                            <span className="flex-shrink-0 text-gray-400">
                              {proofOfAddress.size}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div
                            onClick={() =>
                              window.open(proofOfAddress.url, "_blank")
                            }
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Download
                          </div>
                        </div>
                      </li>
                    )}
                    {!identityDocument &&
                      !bankStatement &&
                      !payrollReceipt &&
                      !proofOfAddress && (
                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                          <div className="flex w-0 flex-1 items-center">
                            <span className="font-medium">
                              No hay documentos
                            </span>
                          </div>
                        </li>
                      )}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCredits

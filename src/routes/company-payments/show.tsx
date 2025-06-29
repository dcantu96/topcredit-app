import { useCallback, useMemo } from "react"
import { useRecoilValue } from "recoil"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"

import NavLink from "components/atoms/nav-link"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"
import Button from "components/atoms/button"
import EmptyList from "components/atoms/empty-list"

import CreditListItem from "./credit-list-item"
import BulkActionsButton from "./bulk-actions-button"
import { companySelectorQuery } from "../companies/loader"
import { companyCreditsDetailedWithPaymentsSelector } from "../../services/companies/atoms"
import { exportToCSV, nextExpectedPaymentDate } from "../../utils"
import { DURATION_TYPES, MXNFormat } from "../../constants"
import { DocumentArrowUpIcon } from "@heroicons/react/24/solid"

const Screen = () => {
  const { companyId } = useParams()
  if (!companyId) throw new Error("companyId is required")
  const company = useRecoilValue(companySelectorQuery(companyId))
  const credits = useRecoilValue(
    companyCreditsDetailedWithPaymentsSelector(companyId),
  ).filter((credit) => {
    const isMissingPayments = credit.payments.find((payment) => !payment.paidAt)
    return isMissingPayments
  })

  const totalPaid = useCallback(
    (creditId: string) => {
      const credit = credits.find((credit) => credit.id === creditId)
      if (!credit) return 0
      return credit.payments.reduce(
        (acc, payment) => acc + (payment.amount ?? 0),
        0,
      )
    },
    [credits],
  )

  const totalDelayed = useMemo(() => {
    return credits.reduce(
      (acc, credit) =>
        acc +
        credit.payments.filter(
          (payment) =>
            !payment.paidAt && dayjs(payment.expectedAt).isBefore(dayjs()),
        ).length *
          Number(credit.amortization),
      0,
    )
  }, [credits])

  if (!credits) return null

  const handleExport = () => {
    exportToCSV(
      [
        "Empleado",
        "Cliente",
        "Nómina",
        "Plazo",
        "Préstamo",
        "Crédito",
        "Pendiente",
        "Descuento",
        "Pagos Realizados",
        "Pagos Pendientes",
        "Último Descuento",
      ],
      credits.map((credit) => {
        if (!credit.loan || !credit.amortization || !credit.termOffering)
          return []
        const lastPayment = credit.payments.findLast(
          (payment) => payment.paidAt,
        )
        const lastPaidAt = lastPayment?.paidAt
        const paymentsDone = lastPayment?.number ?? 0
        const missingPayments = credit.termOffering.term.duration - paymentsDone
        const firstName = credit.borrower.firstName
        const lastName = credit.borrower.lastName
        const fullName = `${firstName} ${lastName}`
        const creditAmount =
          credit.termOffering.term.duration * Number(credit.amortization)
        const term = `${credit.termOffering.term.duration} ${DURATION_TYPES.get(credit.termOffering.term.durationType)}`
        return [
          fullName,
          company.name,
          credit.borrower.employeeNumber ?? "",
          term,
          MXNFormat.format(credit.loan),
          MXNFormat.format(creditAmount),
          MXNFormat.format(creditAmount - totalPaid(credit.id)),
          MXNFormat.format(Number(credit.amortization)),
          paymentsDone.toString(),
          missingPayments.toString(),
          lastPaidAt ? dayjs(lastPaidAt).format("DD/MM/YYYY") : "",
        ]
      }),
      `${company.name.toLowerCase()}-cobranza.csv`,
    )
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Cobranza" to={".."}>
            / <ListHeader.Title text={company.name} /> /
            <ListHeader.Title
              text={
                company.employeeSalaryFrequency === "bi-monthly"
                  ? "Quincenal"
                  : "Mensual"
              }
            />
          </ListHeader.Title>
          <ListHeader.Actions>
            <Button onClick={handleExport} size="sm" status="secondary">
              Exportar
              <DocumentArrowUpIcon className="h-4 w-4 ml-1" />
            </Button>
            <BulkActionsButton companyId={companyId} />
          </ListHeader.Actions>
        </ListHeader>
        {credits.length === 0 && <EmptyList />}
        <List>
          <List.Item>
            <div className="flex-1 min-w-56">
              <div className="flex items-center gap-x-3">
                <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                  Próximo descuento{" "}
                  <b>
                    {" "}
                    {dayjs(
                      nextExpectedPaymentDate(company.employeeSalaryFrequency),
                    )
                      .locale("es")
                      .format("LL")}
                  </b>
                </h2>
              </div>
            </div>

            <div className="min-w-28">
              <p className="whitespace-nowrap text-sm">
                Descuento Total:{" "}
                <b>
                  {MXNFormat.format(
                    Number(
                      credits.reduce(
                        (acc, credit) => acc + Number(credit.amortization),
                        0,
                      ),
                    ),
                  )}
                  MXN
                </b>
              </p>
            </div>
            <div className="min-w-28">
              <p className="whitespace-nowrap text-sm">
                Total Demorado:{" "}
                <b>
                  {MXNFormat.format(Number(totalDelayed))}
                  MXN
                </b>
              </p>
            </div>
          </List.Item>
          {credits.map((credit) => (
            <CreditListItem key={credit.id} credit={credit} />
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

import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { DocumentArrowUpIcon } from "@heroicons/react/24/solid"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"
import ActivityContainer from "components/organisms/activity-container"
import EmptyList from "components/atoms/empty-list"
import useIsRole from "hooks/useIsRole"
import { myProfileState } from "components/providers/auth/atoms"

import ListItem from "./list-item"
import { activeCreditsSelectorQuery } from "./atoms"
import { companySelectorQuery } from "../companies/loader"
import { DURATION_TYPES, MXNFormat } from "../../constants"
import { exportToCSV, nextExpectedPaymentDate } from "../../utils"
import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/es"

dayjs.extend(LocalizedFormat)

import { useCallback, useMemo } from "react"
import Button from "components/atoms/button"

const Screen = () => {
  const { id } = useParams()
  const companyId = useRecoilValue(myProfileState)?.hrCompanyId
  const isAdmin = useIsRole("admin")
  if (!id) throw new Error("Missing id param")
  if (!isAdmin && !companyId) throw new Error("Empresa no asignada al usuario")
  if (!isAdmin && Number(id) !== companyId) throw new Error("No autorizado")
  const company = useRecoilValue(companySelectorQuery(id))
  const credits = useRecoilValue(activeCreditsSelectorQuery(id))
  const nextExpectedPayment = useMemo(
    () => nextExpectedPaymentDate(company.employeeSalaryFrequency),
    [company.employeeSalaryFrequency],
  )

  const totalPaid = useCallback(
    (creditId: string) => {
      const credit = credits.get(creditId)
      if (!credit) throw new Error("Credit not found")
      return credit.payments.reduce(
        (acc, payment) => acc + (payment.amount ?? 0),
        0,
      )
    },
    [credits],
  )

  const getLastPayment = useCallback(
    (creditId: string) => {
      const credit = credits.get(creditId)
      if (!credit) throw new Error("Credit not found")
      return credit.payments
        .toSorted((a, b) => a.number - b.number)
        .findLast((payment) => !!payment.paidAt)
    },
    [credits],
  )

  const getDelayedPayments = useCallback(
    (creditId: string) => {
      const credit = credits.get(creditId)
      if (!credit) throw new Error("Credit not found")
      return credit.payments.filter(
        (payment) =>
          !!payment.expectedAt &&
          new Date(payment.expectedAt) < new Date() &&
          !payment.paidAt,
      ).length
    },
    [credits],
  )

  const handleExport = () => {
    const filteredCredits = Array.from(credits).filter(([, credit]) => {
      // only those credits that have delayed payments or next payment is due
      const delayedPayments = getDelayedPayments(credit.id)
      const nextPayment = credit.payments
        .toSorted((a, b) => a.number - b.number)
        .find(
          (payment) =>
            !!payment.expectedAt && !payment.amount && !payment.paidAt,
        )
      if (!nextPayment) {
        throw new Error("Next payment not found")
      }
      // make sure next payment is not after the next expected payment use the `nextExpectedPayment` variable
      // use dayjs and leave a time frame spread of one hour
      return (
        delayedPayments > 0 ||
        dayjs(nextPayment.expectedAt).isBefore(
          dayjs(nextExpectedPayment),
          "hour",
        )
      )
    })
    exportToCSV(
      [
        "Empleado",
        "Cliente",
        "Nómina",
        "Status",
        "Préstamo",
        "Crédito",
        "Pendiente",
        "Descuento",
        "Plazo",
        "Dctos. Realizados",
        "Dctos. Atrasados",
        "Último Descuento",
        "Total a descontar",
      ],
      filteredCredits.map(([, credit]) => {
        if (!credit.loan || !credit.amortization || !credit.termOffering)
          return []
        const lastPayment = getLastPayment(credit.id)
        const delayedPayments = getDelayedPayments(credit.id)
        const lastPaidAt = lastPayment?.paidAt
        const paymentsDone = lastPayment?.number ?? 0
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
          delayedPayments > 0 ? "Tarde" : "Activo",
          MXNFormat.format(credit.loan),
          MXNFormat.format(creditAmount),
          MXNFormat.format(creditAmount - totalPaid(credit.id)),
          MXNFormat.format(Number(credit.amortization)),
          term,
          paymentsDone.toString(),
          delayedPayments.toString(),
          lastPaidAt
            ? dayjs(lastPaidAt).locale("es").format("LL")
            : "Esperando primer descuento",
          MXNFormat.format(
            Number(credit.amortization) * paymentsDone + totalPaid(credit.id),
          ),
        ]
      }),
      `${company.name.toLowerCase()}-rh.csv`,
    )
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text={`Cartera - ${company?.name}`} />
          <ListHeader.Actions>
            Próximo descuento{" "}
            {dayjs(nextExpectedPayment).locale("es").format("LL")}
            <Button onClick={handleExport} size="sm" status="secondary">
              Exportar
              <DocumentArrowUpIcon className="h-4 w-4 ml-1" />
            </Button>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
        {credits.size === 0 && <EmptyList />}
        <List>
          {Array.from(credits).map(([id, credit]) => (
            <ListItem key={id} credit={credit} />
          ))}
        </List>
      </ListContainer>
      {/* activity */}
      <ActivityContainer
        notificationTypes={["DispersedCredit", "AuthorizedCredit"]}
        to={"/dashboard/dispersions"}
      />
    </>
  )
}

export default Screen

import { useRecoilValue } from "recoil"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import ListItem from "./list-item"
import { DocumentArrowUpIcon, DocumentIcon } from "@heroicons/react/24/solid"
import ActivityContainer from "components/organisms/activity-container"
import { hrCreditsSelectorQuery } from "./atoms"
import ButtonLink from "components/atoms/button-link"
import { myProfileState } from "components/providers/auth/atoms"
import { companySelectorQuery } from "../companies/loader"
import { DURATION_TYPES, MXNFormat } from "../../constants"
import dayjs from "dayjs"
import { exportToCSV } from "../../utils"
import { useCallback } from "react"
import Button from "components/atoms/button"

const Screen = () => {
  const companyId = useRecoilValue(myProfileState)?.hrCompanyId
  const company = useRecoilValue(companySelectorQuery(companyId!.toString()))
  const credits = useRecoilValue(hrCreditsSelectorQuery("active"))

  const totalPaid = useCallback(
    (creditId: string) => {
      const credit = credits.get(creditId)
      if (!credit?.payments) return 0
      return credit.payments.reduce((acc, payment) => acc + payment.amount, 0)
    },
    [credits],
  )

  const handleExport = () => {
    exportToCSV(
      [
        "Empleado",
        "Cliente",
        "Nómina",
        "Plazo",
        "Préstamo",
        "Pendiente",
        "Descuento",
        "Pagos Realizados",
        "Pagos Pendientes",
        "Último Descuento",
      ],
      Array.from(credits).map(([, credit]) => {
        if (!credit.loan || !credit.amortization || !credit.termOffering)
          return []
        const lastPayment = credit.payments?.at(-1)
        const lastPaidAt = lastPayment?.paidAt
        const paymentsDone = lastPayment?.number ?? 0
        const missingPayments = credit.termOffering.term.duration - paymentsDone
        const firstName = credit.borrower.firstName
        const lastName = credit.borrower.lastName
        const fullName = `${firstName} ${lastName}`
        const term = `${credit.termOffering.term.duration} ${DURATION_TYPES.get(credit.termOffering.term.durationType)}`
        return [
          fullName,
          company.name,
          credit.borrower.employeeNumber ?? "",
          term,
          MXNFormat.format(credit.loan),
          MXNFormat.format(credit.loan - totalPaid(credit.id)),
          MXNFormat.format(Number(credit.amortization)),
          paymentsDone.toString(),
          missingPayments.toString(),
          lastPaidAt ? dayjs(lastPaidAt).format("DD/MM/YYYY") : "",
        ]
      }),
      `${company.name.toLowerCase()}-rh.csv`,
    )
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text={"Empleados Activos de " + company?.name} />
          <ListHeader.Actions>
            <ButtonLink size="sm" status="secondary" to="/dashboard/hr">
              Pendientes
              <DocumentIcon className="w-4 h-4 ml-2" />
            </ButtonLink>
            <ButtonLink
              size="sm"
              status="secondary"
              to="/dashboard/hr/inactive"
            >
              Inactivos
              <DocumentIcon className="w-4 h-4 ml-2" />
            </ButtonLink>
            <Button onClick={handleExport} size="sm" status="secondary">
              Exportar
              <DocumentArrowUpIcon className="h-4 w-4 ml-1" />
            </Button>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
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

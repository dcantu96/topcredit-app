import { useRecoilValue } from "recoil"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { ArrowLeftIcon, DocumentArrowUpIcon } from "@heroicons/react/24/solid"
import ButtonLink from "components/atoms/button-link"
import { myProfileState } from "components/providers/auth/atoms"
import { companySelectorQuery } from "../loader"
import ListItem from "./list-item"
import { companyCreditsSelectorQuery } from "./atoms"
import { DURATION_TYPES, MXNFormat } from "../../../constants"
import { useCallback } from "react"
import { exportToCSV } from "../../../utils"
import dayjs from "dayjs"
import Button from "components/atoms/button"

const Screen = () => {
  const companyId = useRecoilValue(myProfileState)?.hrCompanyId
  if (!companyId) throw new Error("companyId is required")
  const company = useRecoilValue(companySelectorQuery(companyId.toString()))
  const credits = useRecoilValue(
    companyCreditsSelectorQuery(companyId.toString()),
  )

  const totalPaid = useCallback(
    (creditId: string) => {
      const credit = credits.get(creditId)
      if (!credit?.payments) return 0
      const paid = credit.payments.reduce(
        (acc, payment) => acc + payment.amount,
        0,
      )
      console.log(credit.borrower.firstName, paid)
      return paid
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
        "Crédito",
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
      `empleados-${company.name.toLowerCase()}.csv`,
    )
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text={"Empleados de " + company.name} />
          <ListHeader.Actions>
            <ButtonLink size="sm" status="secondary" to="..">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Regresar
            </ButtonLink>
            <Button onClick={handleExport} size="sm" status="secondary">
              <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
              Exportar
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
    </>
  )
}

export default Screen

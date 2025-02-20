import { useRecoilValue } from "recoil"
import { useParams } from "react-router-dom"

import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import ListItem from "../list-item"
import { creditDetailedWithPaymentsState } from "../atoms"
import { MXNFormat } from "../../../constants"
import { useMemo } from "react"
import {
  CalendarDateRangeIcon,
  CurrencyDollarIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid"
import RowCard from "components/atoms/row-card"

const Screen = () => {
  const { id } = useParams()
  const credit = useRecoilValue(creditDetailedWithPaymentsState(id!))
  const company = credit.termOffering.company
  const termDuration = credit.termOffering.term.duration

  const totalPaid = credit.payments.reduce(
    (acc, payment) => acc + payment.amount,
    0,
  )

  const { status, hrStatus } = credit

  /**
   * Credit & hr status workflow:
   *
   * 1. new
   * 2. pending
   * 3. invalid-documentation
   * 4. authorized
   * 5. denied
   * 6. HR active
   * 7. dispersed
   * 8. installed
   */
  const creditStatusText = useMemo(() => {
    if (status === "denied") return "Denegado"
    if (status === "invalid-documentation") return "Documentación inválida"

    if (status === "new") return "Nuevo"
    if (status === "pending") return "Pendiente"
    if (status === "authorized") return "Autorizado"
    if (status === "dispersed") {
      if (hrStatus === "approved") return "Aprobado por RH"
      return "Dispersado"
    }
  }, [status, hrStatus])

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Cliente" to={"/dashboard/payments"}>
            /{" "}
            <ListHeader.Title
              text={company.name}
              to={`/dashboard/payments/${company.id}`}
            >
              /{" "}
              <ListHeader.Title
                text={`${credit.borrower.firstName} ${credit.borrower.lastName}`}
              />
            </ListHeader.Title>
          </ListHeader.Title>
        </ListHeader>
        <List>
          <List.Item>
            <RowCard>
              <RowCard.Outline>
                <ListBulletIcon className="fill-current text-gray-500 w-3 h-3 mr-2" />
                Status
              </RowCard.Outline>
              <RowCard.Text>{creditStatusText}</RowCard.Text>
            </RowCard>
            <RowCard>
              <RowCard.Outline>
                <CurrencyDollarIcon className="fill-current text-gray-500 w-3 h-3 mr-2" />
                Préstamo
              </RowCard.Outline>
              <RowCard.Text>{MXNFormat.format(credit.loan!)} MXN</RowCard.Text>
            </RowCard>
            <RowCard>
              <RowCard.Outline>
                <CurrencyDollarIcon className="fill-current text-gray-500 w-3 h-3 mr-2" />
                Crédito
              </RowCard.Outline>
              <RowCard.Text>
                {MXNFormat.format(Number(credit.creditAmount) ?? 0)} MXN
              </RowCard.Text>
            </RowCard>
            <RowCard>
              <RowCard.Outline>
                <CalendarDateRangeIcon className="fill-current text-gray-500 w-3 h-3 mr-2" />
                Plazo
              </RowCard.Outline>
              <RowCard.Text>
                {termDuration}{" "}
                {credit.termOffering.term.durationType === "two-weeks"
                  ? "Quincenas"
                  : "Meses"}
              </RowCard.Text>
            </RowCard>
            <RowCard>
              <RowCard.Outline>
                <CurrencyDollarIcon className="fill-current text-gray-500 w-3 h-3 mr-2" />
                Total Pagado
              </RowCard.Outline>
              <RowCard.Text>{MXNFormat.format(totalPaid)} MXN</RowCard.Text>
            </RowCard>
            <RowCard>
              <RowCard.Outline>
                <CurrencyDollarIcon className="fill-current text-gray-500 w-3 h-3 mr-2" />
                Amortización
              </RowCard.Outline>
              <RowCard.Text>
                {credit.amortization
                  ? MXNFormat.format(Number(credit.amortization))
                  : 0}{" "}
                MXN
              </RowCard.Text>
            </RowCard>
          </List.Item>

          {credit.payments.map((payment, index) => (
            <ListItem key={index} payment={payment} />
          ))}
        </List>
      </ListContainer>
    </>
  )
}

export default Screen

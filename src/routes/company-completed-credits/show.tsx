import { useRecoilValue } from "recoil"
import { useParams } from "react-router-dom"

import NavLink from "components/atoms/nav-link"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { companySelectorQuery } from "../companies/loader"
import ListItem from "./credit-list-item"
import { companyCreditsDetailedWithPaymentsSelector } from "../../services/companies/atoms"
import BulkActions from "./bulk-actions"
import { exportToCSV } from "../../utils"
import { MXNFormat } from "../../constants"
import Button from "components/atoms/button"
import { DocumentArrowDownIcon } from "@heroicons/react/16/solid"

const Screen = () => {
  const { companyId } = useParams()
  if (!companyId) throw new Error("companyId is required")
  const company = useRecoilValue(companySelectorQuery(companyId))
  const credits = useRecoilValue(
    companyCreditsDetailedWithPaymentsSelector(companyId),
  )?.filter((credit) => {
    const isHRApproved = credit.hrStatus === "approved"
    const isMissingPayment = credit.payments.find((payment) => !payment.paidAt)
    return isHRApproved && !isMissingPayment
  })

  if (!credits) return null

  const handleExport = () => {
    exportToCSV(
      ["Empleado", "Cliente", "Nómina", "Crédito", "Descuento Total", "Status"],
      credits.map((credit) => {
        const totalPaid = credit.payments.reduce(
          (acc, payment) => acc + (payment.amount ?? 0),
          0,
        )
        const firstName = credit.borrower.firstName
        const lastName = credit.borrower.lastName
        const fullName = `${firstName} ${lastName}`
        return [
          fullName,
          company.name,
          credit.borrower.employeeNumber ?? "",
          credit.loan !== undefined ? MXNFormat.format(totalPaid) : "",
          MXNFormat.format(totalPaid),
          "Bajas",
        ]
      }),
    )
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Bajas" to={".."}>
            / <ListHeader.Title text={company.name} />
          </ListHeader.Title>
          <ListHeader.Actions>
            <Button size="sm" onClick={handleExport}>
              Exportar
              <DocumentArrowDownIcon className="w-4 h-4 ml-2" />
            </Button>
            <BulkActions companyId={companyId!} />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {credits.map((credit) => (
            <ListItem key={credit.id} credit={credit} />
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

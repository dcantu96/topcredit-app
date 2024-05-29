import { useRecoilValue } from "recoil"
import { useParams } from "react-router-dom"

import NavLink from "components/atoms/nav-link"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { companySelectorQuery } from "../companies/loader"
import CreditListItem from "./credit-list-item"

import { fetchNextPayrollDate } from "../company-installations/utils"
import { companyCreditsDetailedWithPaymentsState } from "../../services/companies/atoms"
import BulkActionsButton from "./bulk-actions-button"

const Screen = () => {
  const { companyId } = useParams()
  const company = useRecoilValue(companySelectorQuery(companyId!))
  const credits = useRecoilValue(
    companyCreditsDetailedWithPaymentsState(companyId),
  )?.filter((credit) => {
    const isInstalled = credit.installationStatus === "installed"
    // check if at least one payment is missing compared to the term duration
    // ! Todo: this should also consider the amortization schedule not just the number of payments
    const isMissingPayments =
      credit.payments?.length !== credit.termOffering.term.duration
    return isInstalled && isMissingPayments
  })
  const nextPayrollDate = fetchNextPayrollDate(
    company.employeeSalaryFrequency,
  ).toLocaleDateString()

  if (!credits) return null

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Cobranza" to={".."}>
            / <ListHeader.Title text={company.name} />
          </ListHeader.Title>
          <ListHeader.Actions>
            <h3 className="text-sm">
              Proxima Nómina <b>{nextPayrollDate}</b>
            </h3>
            <BulkActionsButton companyId={companyId!} />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {credits.map((credit) => (
            <CreditListItem
              key={credit.id}
              credit={credit}
              employeeSalaryFrequency={company.employeeSalaryFrequency}
              termDuration={credit.termOffering.term.duration}
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

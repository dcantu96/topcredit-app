import { useRecoilValue } from "recoil"
import { useParams } from "react-router-dom"

import NavLink from "components/atoms/nav-link"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { companyCreditsDetailedSelector } from "./atoms"
import CreditListItem from "./credit-list-item"

const Screen = () => {
  const { companyId } = useParams()
  const company = useRecoilValue(companyCreditsDetailedSelector(companyId))

  if (!company) {
    return null
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Instalaciones" to={".."}>
            / <ListHeader.Title text={company.name} />
          </ListHeader.Title>
        </ListHeader>
        <List>
          {company.credits.map((credit) => (
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

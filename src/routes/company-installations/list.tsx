import { useRecoilValue } from "recoil"

import NavLink from "components/atoms/nav-link"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { companyCreditsState } from "./atoms"
import ListItem from "./list-item"
import { fetchNextInstallationDueDate } from "./utils"

const Screen = () => {
  const companies = useRecoilValue(companyCreditsState)
  const nextInstallationDueDate =
    fetchNextInstallationDueDate().toLocaleDateString()
  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Instalaciones" />
          <h3 className="text-sm">
            Proxima Instalación <b>{nextInstallationDueDate}</b>
          </h3>
        </ListHeader>
        <List>
          {companies.map((company) => (
            <ListItem key={company.id} company={company} />
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

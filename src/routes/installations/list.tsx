import { useRecoilValue } from "recoil"

import NavLink from "components/atoms/nav-link"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { installationsState } from "./atoms"
import ListItem from "./list-item"
import { Route, Routes, Navigate } from "react-router-dom"
import ButtonLink from "components/atoms/button-link"
import { ArrowRightIcon } from "@heroicons/react/16/solid"

const Screen = () => {
  return (
    <Routes>
      <Route path="incoming" element={<IncomingCredits />} />
      <Route path="active" element={<ActiveCredits />} />
      <Route path="*" element={<Navigate to="incoming" />} />
    </Routes>
  )
}

const IncomingCredits = () => {
  const credits = useRecoilValue(installationsState)
  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Instalaciones (Altas)" />
          <ListHeader.Actions>
            <ButtonLink size="sm" status="secondary" to="../active">
              Ir a Bajas
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </ButtonLink>
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

const ActiveCredits = () => {
  const credits = useRecoilValue(installationsState)
  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Instalaciones (Bajas)" />
          <ListHeader.Actions>
            <ButtonLink size="sm" status="secondary" to="../incoming">
              Ir a Altas
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </ButtonLink>
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

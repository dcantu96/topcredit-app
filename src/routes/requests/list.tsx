import { useRecoilValue } from "recoil"
import { useNavigate } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

import NavLink from "components/atoms/nav-link"
import SmallDot from "components/atoms/small-dot"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"
import ListSortOrderHandler from "components/organisms/list-sort-order-handler"

import { STATES_OF_MEXICO } from "../../constants"
import { basicDetailsSortedSelector } from "./atoms"

const Screen = () => {
  const navigate = useNavigate()
  const basicDetails = useRecoilValue(basicDetailsSortedSelector)

  return (
    <>
      {/* pending request */}
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Solicitudes Pendientes" />
          <ListHeader.Actions>
            <ListSortOrderHandler listName="requests" />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {basicDetails.map((details) => (
            <List.Item key={details.id}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-x-3">
                  <div className="bg-gray-100 p-1 rounded-full flex-none shadow-sm">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  </div>
                  <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                    <a className="flex text-inherit decoration-inherit gap-x-2">
                      <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                        {details.firstName} {details.lastName}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="whitespace-nowrap">
                        {details.email.split("@")[1]}
                      </span>
                    </a>
                  </h2>
                </div>
                <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
                  <p className="whitespace-nowrap">
                    {
                      STATES_OF_MEXICO.find((s) => s.value === details.state)
                        ?.label
                    }
                  </p>
                  <SmallDot />
                  <p className="whitespace-nowrap">
                    {new Date(details.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(details.id)}
                className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-400" />
              </button>
            </List.Item>
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
            <NavLink to="/requests">Ver todo</NavLink>
          </div>
        </header>
      </aside>
    </>
  )
}

export default Screen

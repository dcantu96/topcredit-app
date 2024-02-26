import { useRecoilValue } from "recoil"

import NavLink from "components/atoms/nav-link"
import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import SmallDot from "components/atoms/small-dot"
import Button from "components/atoms/button"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"
import Input from "components/atoms/input"

import { ApprovedUsersResponse, approvedUsersSortedSelector } from "./atoms"
import { MXNFormat } from "../../constants"

const Screen = () => {
  const approvedUsers = useRecoilValue(approvedUsersSortedSelector)

  return (
    <>
      {/* pending request */}
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Solicitudes Pre-Aprobadas" />
          <ListHeader.Actions>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {approvedUsers.map((user) => (
            <ApprovedUserItem key={user.id} user={user} />
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

interface ApprovedUserItemProps {
  user: ApprovedUsersResponse
}

const ApprovedUserItem = ({ user }: ApprovedUserItemProps) => {
  return (
    <List.Item>
      <div className="min-w-80">
        <div className="flex items-center gap-x-3">
          <div className="bg-gray-100 p-1 rounded-full flex-none shadow-sm">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0 flex text-inherit decoration-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-gray-400">/</span>
            <span className="whitespace-nowrap">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-x-3 mt-1">
          <p className="text-gray-500 leading-6 font-medium text-sm min-w-0 flex text-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {user.salary ? MXNFormat.format(user.salary) : 0}
            </span>
            <span className="text-gray-400">/</span>
            <span className="whitespace-nowrap">
              {user.salaryFrequency === "Q" ? "Quincenales" : "Mensuales"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-x-3 text-xs leading-5 text-gray-500">
          <p className="whitespace-nowrap">{user.employeeNumber}</p>
          <SmallDot />
          <p className="whitespace-nowrap">{user.email.split("@")[1]}</p>
        </div>
      </div>
      <div className="flex-1 min-w-96 flex justify-between gap-4">
        <div>
          <Input
            id="loan-amount"
            value="1000"
            onChange={() => {}}
            type="number"
            prefix="$"
            label="Préstamo"
            placeholder="10000"
            trailingDropdownId="loan-amount-frequency"
            trailingDropdownLabel="Frecuencia de pago"
            trailingDropdownOptions={[
              { label: "10 Meses", value: "10 Meses" },
              { label: "12 Meses", value: "12 Meses" },
            ]}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button status="primary" disabled>
            Autorizar
          </Button>
          <Button status="secondary">Rechazar</Button>
        </div>
      </div>
    </List.Item>
  )
}

export default Screen

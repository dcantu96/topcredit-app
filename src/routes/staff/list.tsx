import { useRecoilValue } from "recoil"
import { useNavigate } from "react-router-dom"
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline"

import ButtonLink from "components/atoms/button-link"
import SmallDot from "components/atoms/small-dot"
import Chip from "components/atoms/chip"
import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"
import StatusIndicator from "components/atoms/status-indicator"

import { staffListSelector } from "./atoms"
import { ROLE_OPTIONS } from "../../constants"

const StaffList = () => {
  const staff = useRecoilValue(staffListSelector)
  const navigate = useNavigate()

  return (
    <ListContainer>
      <ListHeader>
        <ListHeader.Title text="Staff">
          <ButtonLink to="new" status="secondary" size="sm">
            Nuevo
            <PlusIcon className="w-4 h-4 ml-1" />
          </ButtonLink>
        </ListHeader.Title>
        <ListHeader.Actions>
          <ListSortOrderHandler listName="companies" />
        </ListHeader.Actions>
      </ListHeader>
      <List>
        {staff.map((user) => (
          <List.Item key={user.id}>
            <div className="flex-1 min-w-60">
              <div className="flex items-center gap-x-3">
                <StatusIndicator color="info" />
                <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0 flex">
                  <a className="flex text-inherit decoration-inherit gap-x-2 mr-2">
                    <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                      {user.first_name} {user.last_name}
                    </span>
                  </a>
                  <ButtonLink
                    size="sm"
                    status="secondary"
                    to={`${user.id}/edit`}
                  >
                    <svg
                      className="h-4 w-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                  </ButtonLink>
                </h2>
              </div>
              <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
                <p className="whitespace-nowrap">
                  Creado el{" "}
                  <span className="font-medium text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </p>
                <SmallDot />
                <p className="whitespace-nowrap">
                  <span className="font-medium text-gray-500">
                    {user.email}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex-1 min-w-60 flex justify-between">
              <div>
                <div className="flex items-center gap-x-3">
                  <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                    <a className="flex text-inherit decoration-inherit gap-x-2">
                      <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                        Roles
                      </span>
                    </a>
                  </h2>
                </div>
                <div className="mt-3 flex items-center gap-[0.625rem] text-xs leading-5 text-gray-400 flex-wrap">
                  {user.roles?.map((role) => (
                    <Chip key={role}>
                      {ROLE_OPTIONS.find(({ value }) => role === value)?.label}
                    </Chip>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate(user.id)}
                className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </List.Item>
        ))}
      </List>
    </ListContainer>
  )
}

export default StaffList

import { useRecoilValue } from "recoil"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import ListItem from "./list-item"
import { DocumentIcon } from "@heroicons/react/24/solid"
import ActivityContainer from "components/organisms/activity-container"
import { activeCreditsSelectorQuery } from "./atoms"
import ButtonLink from "components/atoms/button-link"
import { myProfileState } from "components/providers/auth/atoms"
import { companySelectorQuery } from "../companies/loader"
import { useParams } from "react-router-dom"
import useIsRole from "hooks/useIsRole"
import EmptyList from "components/atoms/empty-list"

const Screen = () => {
  const { id } = useParams()
  const companyId = useRecoilValue(myProfileState)?.hrCompanyId
  const isAdmin = useIsRole("admin")
  if (!id) throw new Error("Missing id param")
  if (!isAdmin && Number(id) !== companyId) throw new Error("Unauthorized")
  const company = useRecoilValue(companySelectorQuery(id))
  const credits = useRecoilValue(activeCreditsSelectorQuery(id))

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text={"Empleados Pendientes de " + company?.name} />
          <ListHeader.Actions>
            <ButtonLink size="sm" status="secondary" to="/dashboard/hr/active">
              Activos
              <DocumentIcon className="w-4 h-4 ml-2" />
            </ButtonLink>
            <ButtonLink
              size="sm"
              status="secondary"
              to="/dashboard/hr/inactive"
            >
              Inactivos
              <DocumentIcon className="w-4 h-4 ml-2" />
            </ButtonLink>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
        {credits.size === 0 && <EmptyList />}
        <List>
          {Array.from(credits).map(([id, credit]) => (
            <ListItem key={id} credit={credit} />
          ))}
        </List>
      </ListContainer>
      {/* activity */}
      <ActivityContainer
        notificationTypes={["DispersedCredit", "AuthorizedCredit"]}
        to={"/dashboard/dispersions"}
      />
    </>
  )
}

export default Screen

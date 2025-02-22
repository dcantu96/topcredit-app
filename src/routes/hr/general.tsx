import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { DocumentIcon } from "@heroicons/react/24/solid"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"
import ActivityContainer from "components/organisms/activity-container"
import ButtonLink from "components/atoms/button-link"
import EmptyList from "components/atoms/empty-list"
import useIsRole from "hooks/useIsRole"
import { myProfileState } from "components/providers/auth/atoms"

import ListItem from "./list-item"
import { activeCreditsSelectorQuery } from "./atoms"
import { companySelectorQuery } from "../companies/loader"

const Screen = () => {
  const { id } = useParams()
  const companyId = useRecoilValue(myProfileState)?.hrCompanyId
  const isAdmin = useIsRole("admin")
  if (!id) throw new Error("Missing id param")
  if (!isAdmin && !companyId) throw new Error("Empresa no asignada al usuario")
  if (!isAdmin && Number(id) !== companyId) throw new Error("No autorizado")
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

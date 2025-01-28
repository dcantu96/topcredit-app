import { useRecoilValue } from "recoil"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import ListItem from "./list-item"
import { DocumentIcon } from "@heroicons/react/24/solid"
import ActivityContainer from "components/organisms/activity-container"
import { hrCreditsSelectorQuery } from "./atoms"
import ButtonLink from "components/atoms/button-link"
import { myProfileState } from "components/providers/auth/atoms"
import { companySelectorQuery } from "../companies/loader"

const Screen = () => {
  const companyId = useRecoilValue(myProfileState)?.hrCompanyId
  const company = useRecoilValue(companySelectorQuery(companyId!.toString()))
  const credits = useRecoilValue(hrCreditsSelectorQuery("inactive"))

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text={"Empleados Inactivos de " + company?.name} />
          <ListHeader.Actions>
            <ButtonLink size="sm" status="secondary" to="/dashboard/hr">
              Pendientes
              <DocumentIcon className="w-4 h-4 ml-2" />
            </ButtonLink>
            <ButtonLink size="sm" status="secondary" to="/dashboard/hr/active">
              Activos
              <DocumentIcon className="w-4 h-4 ml-2" />
            </ButtonLink>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
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

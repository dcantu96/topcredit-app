import { useRecoilValue } from "recoil"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import ListItem from "./list-item"
import { DocumentIcon } from "@heroicons/react/24/solid"
import ActivityContainer from "components/organisms/activity-container"
import { hrCreditsState } from "./atoms"
import ButtonLink from "components/atoms/button-link"
import { myProfileState } from "components/providers/auth/atoms"
import { companySelectorQuery } from "../companies/loader"

const Screen = () => {
  const companyId = useRecoilValue(myProfileState)?.hrCompanyId
  const company = useRecoilValue(companySelectorQuery(companyId!.toString()))
  const credits = useRecoilValue(hrCreditsState("history"))

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title
            text={"Empleados Autorizados de " + company?.name}
          />
          <ListHeader.Actions>
            <ButtonLink size="sm" status="secondary" to="/dashboard/hr">
              Solicitudes
              <DocumentIcon className="w-4 h-4 ml-2" />
            </ButtonLink>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {credits.map((credit) => (
            <ListItem key={credit.id} credit={credit} />
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

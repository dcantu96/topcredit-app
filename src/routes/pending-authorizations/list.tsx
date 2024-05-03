import { useRecoilValue } from "recoil"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { pendingAuthorizationsState } from "./atoms"
import ListItem from "./list-item"
import ActivityContainer from "components/organisms/activity-container"

const Screen = () => {
  const credits = useRecoilValue(pendingAuthorizationsState)

  return (
    <>
      {/* pending request */}
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Autorizaciones Pendientes" />
          <ListHeader.Actions>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {credits.map((credit) => (
            <ListItem key={credit.id} credit={credit} />
          ))}
        </List>
      </ListContainer>
      <ActivityContainer
        notificationTypes={[
          "PendingCredit",
          "AuthorizedCredit",
          "DeniedCredit",
          "InvalidDocumentationCredit",
        ]}
        to={"/dashboard/pre-authorizations"}
      />
    </>
  )
}

export default Screen

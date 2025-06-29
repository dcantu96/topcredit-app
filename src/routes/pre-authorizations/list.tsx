import { useRecoilValue } from "recoil"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { preAuthorizationUsersState } from "./atoms"
import PreAuthorizationListItem from "./list-item"
import ActivityContainer from "components/organisms/activity-container"
import EmptyList from "components/atoms/empty-list"

const Screen = () => {
  const preAuthorizationUsers = useRecoilValue(preAuthorizationUsersState)
  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Solicitudes Pre-Aprobadas" />
          <ListHeader.Actions>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {preAuthorizationUsers.length === 0 && <EmptyList />}
          {preAuthorizationUsers.map((user) => (
            <PreAuthorizationListItem key={user.id} user={user} />
          ))}
        </List>
      </ListContainer>
      <ActivityContainer
        notificationTypes={[
          "PreAuthorizationUser",
          "PreAuthorizedUser",
          "DeniedUser",
        ]}
        to={"/dashboard/pre-authorizations"}
      />
    </>
  )
}

export default Screen

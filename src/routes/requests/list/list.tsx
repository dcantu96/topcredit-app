import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ActivityContainer from "components/organisms/activity-container"

import RequestsList from "./requests-list"

const Screen = () => {
  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Solicitudes Pendientes" />
          <ListHeader.Actions>
            <ListSortOrderHandler listName="requests" />
          </ListHeader.Actions>
        </ListHeader>
        <RequestsList />
      </ListContainer>
      <ActivityContainer
        notificationTypes={["PendingCredit", "PreAuthorizationUser"]}
        to="/dashboard/requests"
      />
    </>
  )
}

export default Screen

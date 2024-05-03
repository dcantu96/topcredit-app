import { useRecoilValue } from "recoil"

import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { companyCreditsState } from "./atoms"
import ListItem from "./list-item"
import ActivityContainer from "components/organisms/activity-container"

const Screen = () => {
  const companies = useRecoilValue(companyCreditsState)

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Instalaciones" />
        </ListHeader>
        <List>
          {companies.map((company) => (
            <ListItem key={company.id} company={company} />
          ))}
        </List>
      </ListContainer>
      {/* activity */}
      <ActivityContainer
        notificationTypes={["DispersedCredit"]}
        to={"/dashboard/dispersions"}
      />
    </>
  )
}

export default Screen

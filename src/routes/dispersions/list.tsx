import { useRecoilValue } from "recoil"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { dispersionsState } from "./atoms"
import ListItem from "./list-item"
import Button from "components/atoms/button"
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid"
import ActivityContainer from "components/organisms/activity-container"
import { exportToCSV } from "../../utils"
import EmptyList from "components/atoms/empty-list"

const Screen = () => {
  const credits = useRecoilValue(dispersionsState)

  const handleExport = () => {
    exportToCSV(
      ["Nombre", "CLABE", "RFC", "Monto"],
      credits.map((credit) => {
        const firstName = credit.borrower.firstName
        const lastName = credit.borrower.lastName
        const fullName = `${firstName} ${lastName}`
        return [
          fullName,
          credit.borrower.bankAccountNumber ?? "",
          credit.borrower.rfc ?? "",
          credit.loan?.toString() ?? "",
        ]
      }),
    )
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Dispersiones" />
          <ListHeader.Actions>
            <Button size="sm" onClick={handleExport}>
              Exportar
              <DocumentArrowDownIcon className="w-4 h-4 ml-2" />
            </Button>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
        {credits.length === 0 && <EmptyList />}
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

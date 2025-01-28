import { useRecoilValue } from "recoil"

import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"

import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import ButtonLink from "components/atoms/button-link"
import { myProfileState } from "components/providers/auth/atoms"
import { companySelectorQuery } from "../loader"
import ListItem from "./list-item"
import { companyCreditsSelectorQuery } from "./atoms"

const Screen = () => {
  const companyId = useRecoilValue(myProfileState)?.hrCompanyId
  if (!companyId) throw new Error("companyId is required")
  const company = useRecoilValue(companySelectorQuery(companyId.toString()))
  const credits = useRecoilValue(
    companyCreditsSelectorQuery(companyId.toString()),
  )

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text={"Empleados de " + company.name} />
          <ListHeader.Actions>
            <ButtonLink size="sm" status="secondary" to="..">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Regresar
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
    </>
  )
}

export default Screen

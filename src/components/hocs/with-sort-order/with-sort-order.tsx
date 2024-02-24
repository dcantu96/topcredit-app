import { useRecoilState } from "recoil"
import { ListName, listSortOrderState } from "./atoms"
import type { SortButtonProps } from "components/molecules/sort-button/types"

interface SortOrderStateManagementProps {
  listName: ListName
}

function withSortOrder(Component: React.ComponentType<SortButtonProps>) {
  const WithSortOrderStateManagement: React.FC<
    SortOrderStateManagementProps
  > = (props) => {
    const [selectedSortOrder, setSelectedSortOrder] = useRecoilState(
      listSortOrderState(props.listName),
    )
    return (
      <Component
        sortOrder={selectedSortOrder}
        onSortChange={(newSort) => {
          setSelectedSortOrder((prev) =>
            prev === newSort ? undefined : newSort,
          )
        }}
      />
    )
  }

  return WithSortOrderStateManagement
}

export default withSortOrder

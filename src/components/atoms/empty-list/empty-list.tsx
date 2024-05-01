import EmptyFolder from "../../../assets/empty-folder.png"
import EmptyContainer from "../empty-container"
import type { EmptyListProps } from "./empty-list.types"

const EmptyList = ({
  message = "No hay datos",
}: EmptyListProps): JSX.Element => {
  return (
    <EmptyContainer>
      <img src={EmptyFolder} alt="Empty folder" className="w-24 sm:w-32 mb-2" />
      <p className="font-semibold text-center">{message}</p>
    </EmptyContainer>
  )
}

export default EmptyList

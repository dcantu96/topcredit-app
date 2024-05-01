import LoadingAnimation from "../../../assets/loading.gif"
import EmptyContainer from "../empty-container"
import type { LoadingListProps } from "./loading-list.types"

const LoadingList = ({
  message = "Cargando",
}: LoadingListProps): JSX.Element => {
  return (
    <EmptyContainer>
      <img src={LoadingAnimation} alt="loading" className="w-24 sm:w-32" />
      <p className="font-semibold text-center">{message}</p>
    </EmptyContainer>
  )
}

export default LoadingList

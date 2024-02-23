import { CheckIcon } from "@heroicons/react/24/solid"
import Button from "components/atoms/button"
import { useRequestActions } from "routes/requests/actions"

const ApproveRequestButton = ({ id }: { id: number }) => {
  const { approveUser } = useRequestActions(id)

  return (
    <Button size="sm" onClick={approveUser}>
      <CheckIcon className="w-4 h-4 text-white p-0" />
    </Button>
  )
}

export default ApproveRequestButton

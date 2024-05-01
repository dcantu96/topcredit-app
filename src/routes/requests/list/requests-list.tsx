import { Suspense } from "react"
import { ChevronRightIcon } from "@heroicons/react/24/solid"
import EmptyList from "components/atoms/empty-list"
import LoadingList from "components/atoms/loading-list"
import List from "components/atoms/list"
import SmallDot from "components/atoms/small-dot"
import StatusIndicator from "components/atoms/status-indicator"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { STATES_OF_MEXICO } from "../../../constants"
import { basicDetailsSortedSelector } from "../atoms"

const LoadedRequestsList = () => {
  const navigate = useNavigate()
  const basicDetails = useRecoilValue(basicDetailsSortedSelector)
  return (
    <List>
      {basicDetails.length === 0 && <EmptyList />}
      {basicDetails.map((details) => (
        <List.Item key={details.id}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-x-3">
              <StatusIndicator color="info" />
              <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                <a className="flex text-inherit decoration-inherit gap-x-2">
                  <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                    {details.firstName} {details.lastName}
                  </span>
                  <span className="text-gray-400">/</span>
                  <span className="whitespace-nowrap">
                    {details.email.split("@")[1]}
                  </span>
                </a>
              </h2>
            </div>
            <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
              <p className="whitespace-nowrap">
                {STATES_OF_MEXICO.find((s) => s.value === details.state)?.label}
              </p>
              <SmallDot />
              <p className="whitespace-nowrap">
                {new Date(details.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/requests/" + details.id)}
            className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-400" />
          </button>
        </List.Item>
      ))}
    </List>
  )
}

const RequestsList = () => {
  return (
    <Suspense fallback={<LoadingList />}>
      <LoadedRequestsList />
    </Suspense>
  )
}

export default RequestsList

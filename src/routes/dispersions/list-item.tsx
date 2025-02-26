import { useNavigate } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

import List from "components/atoms/list"
import SmallDot from "components/atoms/small-dot"
import StatusIndicator from "components/atoms/status-indicator"

import { Credit } from "src/schema.types"
import { MXNFormat } from "../../constants"

const ListItem = ({
  credit,
}: {
  credit: Pick<
    Credit,
    | "id"
    | "status"
    | "updatedAt"
    | "createdAt"
    | "loan"
    | "termOffering"
    | "borrower"
  >
}) => {
  const navigate = useNavigate()
  const companyDomain = credit.borrower.email.split("@")[1]

  return (
    <List.Item>
      <div className="flex-1 min-w-56">
        <div className="flex items-center gap-x-3">
          <StatusIndicator color="info" />
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                {credit.borrower.firstName} {credit.borrower.lastName}
              </span>
              <span className="text-gray-400">/</span>
              <span className="whitespace-nowrap">{companyDomain}</span>
            </a>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
          <p className="whitespace-nowrap">
            {new Date(credit.createdAt).toLocaleDateString()}
          </p>
          <SmallDot />
          <p className="whitespace-nowrap font-semibold">
            {credit.termOffering!.term.duration}{" "}
            {credit.termOffering!.term.durationType === "bi-monthly"
              ? "Quincenas"
              : "Meses"}
          </p>
        </div>
      </div>
      <div className="min-w-48">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                CLABE
              </span>
            </a>
          </h2>
        </div>
        <span className="whitespace-nowrap">
          {credit.borrower.bankAccountNumber}
        </span>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Monto
              </span>
            </a>
          </h2>
        </div>
        {credit.termOffering && (
          <span className="whitespace-nowrap">
            {credit.loan ? MXNFormat.format(credit.loan) : 0}
          </span>
        )}
      </div>
      <button
        onClick={() => navigate("/dashboard/dispersions/" + credit.id)}
        className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
      </button>
    </List.Item>
  )
}

export default ListItem

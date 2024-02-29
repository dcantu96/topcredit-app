import { ChevronRightIcon } from "@heroicons/react/24/outline"
import List from "components/atoms/list"
import SmallDot from "components/atoms/small-dot"
import { useNavigate } from "react-router-dom"
import { MXNFormat } from "../../constants"
import { Credit } from "src/schema.types"
import useCompanies from "hooks/useCompanies"
import useCreditAmortization from "hooks/useCreditAmortization"

const ListItem = ({ credit }: { credit: Credit }) => {
  const navigate = useNavigate()
  const companiesMap = useCompanies()
  const amortization = useCreditAmortization(credit.id)

  const companyDomain = credit.borrower.email.split("@")[1]
  const company = companiesMap.get(companyDomain)
  return (
    <List.Item>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-x-3">
          <div className="bg-gray-100 p-1 rounded-full flex-none shadow-sm">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
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
            {credit.loan ? MXNFormat.format(credit.loan) : 0}
          </p>
          <SmallDot />
          <p className="whitespace-nowrap">
            {new Date(credit.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button
        onClick={() =>
          navigate("/dashboard/pending-authorizations/" + credit.id)
        }
        className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
      </button>
    </List.Item>
  )
}

export default ListItem

import List from "components/atoms/list"
import { type CompanyCredits } from "./atoms"
import { useNavigate } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/16/solid"

const ListItem = ({ company }: { company: CompanyCredits }) => {
  const navigate = useNavigate()
  return (
    <List.Item>
      <div className="flex-1 min-w-56">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                {company.name}
              </span>
              <span className="text-gray-400">/</span>
              <span className="whitespace-nowrap">{company.domain}</span>
            </a>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
          <p className="whitespace-nowrap">
            {new Date(company.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Altas pendientes
              </span>
            </a>
          </h2>
        </div>
        <span className="whitespace-nowrap">
          {company.credits.length} Créditos
        </span>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Bajas pendientes
              </span>
            </a>
          </h2>
        </div>
        <span className="whitespace-nowrap">
          {company.credits.length} Créditos
        </span>
      </div>
      <button
        onClick={() => navigate("/dashboard/installations/" + company.id)}
        className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
      </button>
    </List.Item>
  )
}

export default ListItem

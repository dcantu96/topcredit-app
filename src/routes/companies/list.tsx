import { useRecoilValue } from "recoil"
import { companies } from "./loader"
import ButtonLink from "components/atoms/button-link"
import SmallDot from "components/atoms/small-dot"
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"
import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import Chip from "components/atoms/chip"
import { DURATION_TYPES } from "../../constants"

const CompaniesList = () => {
  const companyData = useRecoilValue(companies)
  const navigate = useNavigate()

  console.log(companyData)

  return (
    <div className="flex-1 flex-shrink-0">
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-gray-900/10 border-b flex items-center justify-between">
        <div className="flex gap-2">
          <h2 className="text-gray-900 leading-7 font-semibold text-base">
            Clientes
          </h2>
          <ButtonLink to="new" status="secondary" size="sm">
            Nuevo
            <PlusIcon className="w-4 h-4 ml-1" />
          </ButtonLink>
        </div>
        <ListSortOrderHandler listName="companies" />
      </header>
      <ul className="list-none m-0 p-0" role="list">
        {companyData.map((company) => (
          <li
            key={company.id}
            className="py-4 px-4 sm:px-6 lg:px-8 items-center flex relative border-b border-gray-900/10 flex-wrap"
          >
            <div className="flex-1 min-w-60">
              <div className="flex items-center gap-x-3">
                <div className="bg-gray-100 p-1 rounded-full flex-none shadow-sm">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
                <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0 flex">
                  <a className="flex text-inherit decoration-inherit gap-x-2 mr-2">
                    <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                      {company.name}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="whitespace-nowrap">{company.domain}</span>
                  </a>
                  <ButtonLink
                    size="sm"
                    status="secondary"
                    to={`${company.id}/edit`}
                  >
                    <svg
                      className="h-4 w-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                  </ButtonLink>
                </h2>
              </div>
              <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
                <p className="whitespace-nowrap">
                  Tasa {company.rate ? `${company.rate * 100}%` : "N/A"}
                </p>
                <SmallDot />
                <p className="whitespace-nowrap">
                  {new Date(company.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex-1 min-w-60 flex justify-between">
              <div>
                <div className="flex items-center gap-x-3">
                  <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                    <a className="flex text-inherit decoration-inherit gap-x-2">
                      <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                        Plazos
                      </span>
                    </a>
                  </h2>
                </div>
                <div className="mt-3 flex items-center gap-[0.625rem] text-xs leading-5 text-gray-400 flex-wrap">
                  {company.terms.map((term) => (
                    <Chip key={term.id}>
                      {term.duration} {DURATION_TYPES.get(term.durationType)}
                    </Chip>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate(company.id)}
                className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CompaniesList

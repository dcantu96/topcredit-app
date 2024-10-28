import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"

import { companySelectorQuery } from "./loader"
import ButtonLink from "components/atoms/button-link"
import Chip from "components/atoms/chip"

import { DURATION_TYPES } from "../../constants"
import { myProfileState } from "components/providers/auth/atoms"

const ShowCompany = () => {
  const { id } = useParams()
  const user = useRecoilValue(myProfileState)
  if (!user?.roles.includes("admin") && id !== user?.hrCompanyId)
    throw new Error("Unauthorized")
  if (!id) throw new Error("Missing id param")
  const { name, domain, rate, termOfferings } = useRecoilValue(
    companySelectorQuery(id),
  )

  return (
    <div className="flex w-full flex-col">
      <header className="pt-6 pb-4 sm:pb-6">
        <div className="px-4 gap-6 items-center flex-wrap max-w-7xl flex mx-auto sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 className="text-gray-900 text-base leading-7 font-semibold">
            Cashflow
          </h1>
          <div className="leading-6 font-semibold text-sm gap-8 w-full flex order-last sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7 mr-auto">
            <a href="#" className="text-indigo-600">
              Last 7 days
            </a>
            <a href="#" className="text-gray-700">
              Last 30 days
            </a>
            <a href="#" className="text-gray-700">
              All-time
            </a>
          </div>
        </div>
      </header>

      <div className="border-b border-gray-900/10 lg:border-t border-t-gray-900/5">
        <dl className="grid mx-auto max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Revenue
            </dt>
            <dd className="text-xs font-medium text-gray-500">+4.75%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              $405,091.00
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 sm:border-l border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Overdue invoices
            </dt>
            <dd className="text-xs font-medium text-gray-500">+54.02%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              $12,787.00
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 border-t lg:border-l lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Outstanding invoices
            </dt>
            <dd className="text-xs font-medium text-gray-500">-1.39%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              $245,988.00
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 sm:border-l border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Expenses
            </dt>
            <dd className="text-xs font-medium text-gray-500">+10.18%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              $30,156.00
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default ShowCompany

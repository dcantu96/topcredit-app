import { useNavigate } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

import List from "components/atoms/list"
import SmallDot from "components/atoms/small-dot"

import { MXNFormat } from "../../constants"
import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import { HRRequestCredit } from "./atoms"
import "dayjs/locale/es"

dayjs.extend(LocalizedFormat)

const ListItem = ({ credit }: { credit: HRRequestCredit }) => {
  const navigate = useNavigate()

  return (
    <List.Item>
      <div className="flex-1 min-w-56">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 items-center leading-6 font-semibold text-sm min-w-0 flex text-inherit decoration-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {credit.borrower.firstName} {credit.borrower.lastName}
            </span>
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-500">
          <p className="whitespace-nowrap">{credit.borrower.phone}</p>
          <span className="hidden md:block">
            <SmallDot />
          </span>
          <p className="whitespace-nowrap font-semibold hidden md:block">
            Préstamo {credit.loan ? MXNFormat.format(credit.loan) : 0}
          </p>
        </div>
      </div>
      <div className="min-w-32 self-end">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 items-center leading-6 font-medium text-sm min-w-0 flex text-inherit decoration-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              Fecha est. primer descuento
            </span>
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-500">
          <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
            {dayjs(credit.firstDiscountDate).format("LL")}
          </span>
        </div>
      </div>
      <button
        onClick={() => navigate(credit.id)}
        className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
      </button>
    </List.Item>
  )
}

export default ListItem

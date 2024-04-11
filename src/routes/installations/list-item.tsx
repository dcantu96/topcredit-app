import List from "components/atoms/list"
import SmallDot from "components/atoms/small-dot"

import { DURATION_TYPES, MXNFormat } from "../../constants"

import type { InstalledCredit } from "./atoms"

const ListItem = ({ credit }: { credit: InstalledCredit }) => {
  const companyDomain = credit.borrower.email.split("@")[1]

  return (
    <List.Item>
      <div className="flex-1 min-w-56">
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
            {new Date(credit.createdAt).toLocaleDateString()}
          </p>
          <SmallDot />
          <p className="whitespace-nowrap">Monto</p>
          <SmallDot />
          <p className="whitespace-nowrap font-semibold">
            {credit.loan ? MXNFormat.format(credit.loan) : 0}
          </p>
        </div>
      </div>
      <div className="min-w-48">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Fecha de dispersión
              </span>
            </a>
          </h2>
        </div>
        <span className="whitespace-nowrap">
          {credit.dispersedAt
            ? new Date(credit.dispersedAt).toLocaleDateString()
            : "-"}
        </span>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Plazo
              </span>
            </a>
          </h2>
        </div>
        {credit.term && (
          <span className="whitespace-nowrap">
            {credit.term.duration}{" "}
            {DURATION_TYPES.get(credit.term.durationType)}
          </span>
        )}
      </div>
    </List.Item>
  )
}

export default ListItem

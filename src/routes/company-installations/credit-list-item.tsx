import List from "components/atoms/list"
import type { CompanyCreditsDetailed } from "./atoms"

const ListItem = ({
  credit,
}: {
  credit: CompanyCreditsDetailed["credits"][number]
}) => {
  return (
    <List.Item>
      <div className="flex-1 min-w-56">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                {credit.borrower.firstName} {credit.borrower.lastName}
              </span>
              <span className="text-gray-400">/</span>
              <span className="whitespace-nowrap">{credit.loan} MXN</span>
            </a>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
          <p className="whitespace-nowrap">
            {credit.dispersedAt
              ? new Date(credit.dispersedAt).toLocaleDateString()
              : ""}
          </p>
        </div>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Estatus
              </span>
            </a>
          </h2>
        </div>
        <span className="whitespace-nowrap">{credit.installationStatus}</span>
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
        <span className="whitespace-nowrap">{credit.id} Créditos</span>
      </div>
    </List.Item>
  )
}

export default ListItem

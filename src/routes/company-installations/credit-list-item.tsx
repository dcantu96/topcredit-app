import List from "components/atoms/list"
import type { CompanyCreditDetailed } from "./atoms"
import { useMemo } from "react"
import { expectedInstallationDate, hasDelayedInstallation } from "./utils"
import Chip from "components/atoms/chip"
import { useRecoilState } from "recoil"
import { installedCreditSelectedState } from "./atoms"
import { MXNFormat } from "../../constants"
import SmallDot from "components/atoms/small-dot"

const ListItem = ({ credit }: { credit: CompanyCreditDetailed }) => {
  const [pressed, setPressed] = useRecoilState(
    installedCreditSelectedState(credit.id),
  )
  const status = useMemo(() => {
    if (hasDelayedInstallation(credit)) {
      return "delayed"
    }
    return "pending"
  }, [credit])
  return (
    <List.Item>
      <div className="flex-1 min-w-56">
        <div className="flex items-center gap-x-3">
          <label htmlFor={credit.id}>
            <div className="flex group active:ring-2 ring-black rounded">
              <input
                tabIndex={0}
                id={credit.id}
                type="checkbox"
                checked={pressed}
                onChange={() => setPressed(!pressed)}
                onKeyDown={(e) => {
                  console.log(e.key)
                  if (e.key === "Enter") {
                    setPressed(!pressed)
                  }
                }}
                className="rounded h-4 w-4 cursor-pointer bg-white border-indigo-300 text-indigo-600 focus:ring-indigo-200"
              />
            </div>
          </label>
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <label
              htmlFor={credit.id}
              className="cursor-pointer hover:text-gray-700"
            >
              <a className="flex text-inherit decoration-inherit gap-x-2">
                <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  {credit.borrower.firstName} {credit.borrower.lastName}
                </span>
                <span className="text-gray-400">/</span>
                <span className="whitespace-nowrap">
                  {MXNFormat.format(credit.loan!)} MXN
                </span>
              </a>
            </label>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
          <p className="whitespace-nowrap">
            Dispersado el{" "}
            <b>
              {credit.dispersedAt
                ? new Date(credit.dispersedAt).toLocaleDateString()
                : ""}
            </b>
          </p>
          <SmallDot />
          <p
            className={`whitespace-nowrap ${status === "pending" ? "" : "text-red-600"}`}
          >
            Fecha de instalación esperada{" "}
            <b>
              {expectedInstallationDate(
                credit.dispersedAt!,
              ).toLocaleDateString()}
            </b>
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
        <Chip status={status === "delayed" ? "error" : "info"}>
          {status === "delayed" ? "Demorado" : "Pendiente"}
        </Chip>
      </div>
    </List.Item>
  )
}

export default ListItem

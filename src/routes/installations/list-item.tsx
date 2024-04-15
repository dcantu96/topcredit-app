import { useRecoilState } from "recoil"

import List from "components/atoms/list"
import SmallDot from "components/atoms/small-dot"

import { DURATION_TYPES, MXNFormat } from "../../constants"

import { installedCreditSelectedState, type InstalledCredit } from "./atoms"

const ListItem = ({ credit }: { credit: InstalledCredit }) => {
  const [pressed, setPressed] = useRecoilState(
    installedCreditSelectedState(credit.id),
  )
  const companyDomain = credit.borrower.email.split("@")[1]

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
                <span className="whitespace-nowrap">{companyDomain}</span>
              </a>
            </label>
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
        {credit.termOffering && (
          <span className="whitespace-nowrap">
            {credit.termOffering.term.duration}{" "}
            {DURATION_TYPES.get(credit.termOffering.term.durationType)}
          </span>
        )}
      </div>
    </List.Item>
  )
}

export default ListItem

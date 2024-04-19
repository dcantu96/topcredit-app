import List from "components/atoms/list"
import { type CompanyCredits } from "./atoms"
import { useNavigate } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/16/solid"
import { Credit, CreditStatus } from "src/schema.types"
import { expectedInstallationDate } from "./utils"

const ListItem = ({ company }: { company: CompanyCredits }) => {
  const navigate = useNavigate()
  console.log(company)
  const pendingInstallations = company.credits
    .filter(creditStatusIs("dispersed"))
    .filter(installationStatusIs(null))
  const installedCredits = company.credits
    .filter(creditStatusIs("dispersed"))
    .filter(installationStatusIs("installed"))

  const delayedInstallations = company.credits
    .filter(creditStatusIs("dispersed"))
    .filter(installationStatusIs(null))
    .filter(
      (credit) =>
        new Date(credit.dispersedAt!) <
        expectedInstallationDate(credit.dispersedAt!),
    )

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
            <b>{pendingInstallations.length}</b> Inst. pendientes
          </p>
        </div>
      </div>
      {installedCredits.length ? (
        <div className="min-w-32">
          <div className="flex items-center gap-x-3">
            <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
              <a className="flex text-inherit decoration-inherit gap-x-2">
                <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  Inst. realizadas
                </span>
              </a>
            </h2>
          </div>
          <span className="whitespace-nowrap">{installedCredits.length}</span>
        </div>
      ) : null}
      {delayedInstallations.length ? (
        <div className="min-w-32">
          <div className="flex items-center gap-x-3">
            <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
              <a className="flex text-inherit decoration-inherit gap-x-2">
                <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  Inst. demoradas
                </span>
              </a>
            </h2>
          </div>
          <span className="whitespace-nowrap">
            {delayedInstallations.length}
          </span>
        </div>
      ) : null}
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

const installationStatusIs =
  (status: "installed" | null) =>
  (credit: Pick<Credit, "id" | "status" | "installationStatus">) =>
    credit.installationStatus === status

const creditStatusIs =
  (status: CreditStatus) =>
  (credit: Pick<Credit, "id" | "status" | "installationStatus">) =>
    credit.status === status

import List from "components/atoms/list"
import { type CompanyCredits } from "./atoms"
import { useNavigate } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/16/solid"
import {
  installationStatusIs,
  creditStatusIs,
  hasDelayedInstallation,
  installationOnTime,
} from "./utils"
import Chip from "components/atoms/chip"

const ListItem = ({ company }: { company: CompanyCredits }) => {
  const navigate = useNavigate()

  const dispersedCredits = company.credits.filter(creditStatusIs("dispersed"))

  const pendingInstallations = dispersedCredits.filter(
    installationStatusIs(null),
  )

  const delayedInstallations = pendingInstallations.filter(
    hasDelayedInstallation,
  )

  const onTimeInstallations = pendingInstallations.filter(installationOnTime)

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
      </div>
      {delayedInstallations.length || onTimeInstallations.length ? (
        <div className="min-w-32">
          <div className="flex items-center gap-x-3">
            <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
              <a className="flex text-inherit decoration-inherit gap-x-2">
                <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  Instalaciones
                </span>
              </a>
            </h2>
          </div>
          <div className="flex gap-2 mt-3">
            {delayedInstallations.length ? (
              <Chip status="error">
                {delayedInstallations.length} Demoradas
              </Chip>
            ) : null}
            {onTimeInstallations.length ? (
              <Chip status="info">{onTimeInstallations.length} Pendientes</Chip>
            ) : null}
          </div>
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

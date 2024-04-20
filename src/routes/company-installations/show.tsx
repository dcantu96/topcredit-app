import { useRecoilCallback, useRecoilValue } from "recoil"
import { useParams } from "react-router-dom"

import NavLink from "components/atoms/nav-link"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"
import Button from "components/atoms/button"
import { apiSelector } from "components/providers/api/atoms"
import useToast from "components/providers/toaster/useToast"

import { companySelectorQuery } from "../companies/loader"
import CreditListItem from "./credit-list-item"
import {
  companyCreditsDetailedState,
  installedCreditSelectedState,
  selectedInstalledCreditIdsState,
} from "./atoms"
import { fetchNextInstallationDueDate } from "./utils"
import { useState } from "react"
import Dialog from "components/molecules/dialog"

interface BulkActionsButtonProps {
  companyId: string
}

const BulkActionsButton = ({ companyId }: BulkActionsButtonProps) => {
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedCredits = useRecoilValue(
    selectedInstalledCreditIdsState(companyId),
  )
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleInstallCredits = useRecoilCallback(
    ({ snapshot, set, reset }) =>
      async () => {
        const api = await snapshot.getPromise(apiSelector)
        const selectedCredits = await snapshot.getPromise(
          selectedInstalledCreditIdsState(companyId),
        )

        for (const creditId of selectedCredits) {
          await api.update(
            "credits",
            {
              id: creditId,
              installationStatus: "installed",
              installationDate: new Date().toISOString(),
            },
            {
              params: {
                fields: {
                  credits:
                    "id,loan,dispersedAt,installationStatus,installationDate",
                },
              },
            },
          )
          reset(installedCreditSelectedState(creditId))
        }

        set(companyCreditsDetailedState(companyId), (oldCredits) => {
          return oldCredits?.filter(
            (credit) => !selectedCredits.includes(credit.id),
          )
        })

        toast.success({
          title: "Créditos instalados",
          message: "se han instalado los créditos seleccionados",
        })
        closeModal()
      },
    [companyId],
  )

  const modalMessage = `Esto instalará ${selectedCredits.length} créditos. ¿Estás seguro? Una vez instalados no podrás deshacer esta acción.`

  if (!selectedCredits.length) return null
  return (
    <>
      <Button size="sm" onClick={openModal}>
        Instalar ({selectedCredits.length})
      </Button>
      {isModalOpen ? (
        <Dialog
          message={modalMessage}
          onCancel={closeModal}
          onClose={handleInstallCredits}
          title="Instalar créditos"
          inputLabel="Escribe 'instalar' para confirmar"
          type="danger"
        />
      ) : null}
    </>
  )
}

const Screen = () => {
  const { companyId } = useParams()
  const company = useRecoilValue(companySelectorQuery(companyId!))
  const credits = useRecoilValue(companyCreditsDetailedState(companyId))
  const nextInstallationDueDate =
    fetchNextInstallationDueDate().toLocaleDateString()

  if (!credits) return null

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Instalaciones" to={".."}>
            / <ListHeader.Title text={company.name} />/{" "}
            <ListHeader.Title text="Altas" />
          </ListHeader.Title>
          <ListHeader.Actions>
            <h3 className="text-sm">
              Proxima Instalación <b>{nextInstallationDueDate}</b>
            </h3>
            <BulkActionsButton companyId={companyId!} />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {credits.map((credit) => (
            <CreditListItem key={credit.id} credit={credit} />
          ))}
        </List>
      </ListContainer>
      {/* activity */}
      <aside className="bg-slate-50 lg:border-gray-900/10 lg:border-l w-full lg:w-96 lg:top-16 lg:h-full h-fit">
        <header className="py-4 px-4 sm:px-6 lg:px-8 min-h-[70px] border-gray-900/10 border-b flex items-center">
          <div className="flex items-baseline justify-between flex-1">
            <h2 className="text-gray-900 leading-7 font-semibold text-base">
              Actividad
            </h2>
            <NavLink to="/pre-authorizations">Ver todo</NavLink>
          </div>
        </header>
      </aside>
    </>
  )
}

export default Screen

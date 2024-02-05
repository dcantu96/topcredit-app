import ButtonLink from "components/atoms/button-link"
import Table from "components/organisms/table"
import { STATES_OF_MEXICO } from "../../constants"
import { CheckIcon, XMarkIcon, EyeIcon } from "@heroicons/react/24/solid"
import Button from "components/atoms/button"
import { useRecoilValue } from "recoil"
import { basicDetailsSortedSelector } from "./atoms"
import { useRequestActions } from "./actions"
import { useState } from "react"
import Dialog from "components/molecules/dialog"
import { AnimatePresence } from "framer-motion"

const Screen = () => {
  const basicDetails = useRecoilValue(basicDetailsSortedSelector)
  return (
    <div>
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold">Gestión de Solicitudes</h2>
      </div>
      <Table>
        <Table.Header
          columns={["Nombre", "Nómina", "Estado", "Fecha", "Acciones"]}
        />
        <tbody className="bg-white">
          {basicDetails.map((details) => (
            <tr key={details.id}>
              <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                {details.firstName} {details.lastName}
              </td>
              <td className="border-b border-slate-100 p-4 text-slate-500">
                {details.employeeNumber}
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                {
                  STATES_OF_MEXICO.find(
                    (state) => state.value === details.state,
                  )?.label
                }
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500">
                {new Date(details.createdAt).toLocaleDateString()}
              </td>
              <td className="border-b border-slate-100 p-4 pr-8 text-slate-500 flex gap-2">
                <ApproveRequestButton id={details.id} />
                <DenyRequestButton id={details.id} />
                <ButtonLink
                  size="sm"
                  status="secondary"
                  to={details.id.toString()}
                >
                  <EyeIcon className="w-4 h-4 text-gray-600 p-0" />
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Screen

const DenyRequestButton = ({ id }: { id: number }) => {
  const { denyUser } = useRequestActions(id)
  const [isModalOpen, setModalOpen] = useState(false)
  const showModal = () => setModalOpen(true)

  const handleDeny = () => {
    denyUser()
    setModalOpen(false)
  }

  return (
    <>
      <Button size="sm" variant="danger" onClick={showModal}>
        <XMarkIcon className="w-4 h-4 text-white p-0" />
      </Button>
      <AnimatePresence>
        {isModalOpen && (
          <Dialog
            onClose={handleDeny}
            onCancel={() => setModalOpen(false)}
            type="danger"
            title="Rechazar solicitud"
            message="¿Estás seguro de que deseas rechazar esta solicitud? Esto va a cancelar el proceso de registro del usuario."
            confirmText="Rechazar"
            cancelText="Cancelar"
          />
        )}
      </AnimatePresence>
    </>
  )
}

const ApproveRequestButton = ({ id }: { id: number }) => {
  const { approveUser } = useRequestActions(id)

  return (
    <Button size="sm" onClick={approveUser}>
      <CheckIcon className="w-4 h-4 text-white p-0" />
    </Button>
  )
}

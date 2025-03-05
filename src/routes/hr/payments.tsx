import { useParams } from "react-router-dom"
import { useRecoilCallback, useRecoilValue } from "recoil"
import { CheckIcon } from "lucide-react"

import Button from "components/atoms/button"
import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"
import ActivityContainer from "components/organisms/activity-container"
import EmptyList from "components/atoms/empty-list"
import useIsRole from "hooks/useIsRole"
import { myProfileState } from "components/providers/auth/atoms"

import ListItem from "./payment-list-item"
import {
  activeCreditsSelectorQuery,
  creditPressed,
  creditSelectionState,
  selectedCreditsSelector,
  totalToCollectState,
} from "./atoms"
import { companySelectorQuery } from "../companies/loader"
import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/es"
import { MXNFormat } from "../../constants"
import { useState } from "react"
import Modal from "components/molecules/modal"
import { apiSelector } from "components/providers/api/atoms"

dayjs.extend(LocalizedFormat)

const Screen = () => {
  const { id } = useParams()
  const companyId = useRecoilValue(myProfileState)?.hrCompanyId
  const isAdmin = useIsRole("admin")
  if (!id) throw new Error("Missing id param")
  if (!isAdmin && !companyId) throw new Error("Empresa no asignada al usuario")
  if (!isAdmin && Number(id) !== companyId) throw new Error("No autorizado")
  const company = useRecoilValue(companySelectorQuery(id))
  const credits = useRecoilValue(activeCreditsSelectorQuery(id))
  const selectedState = useRecoilValue(creditSelectionState(id))
  const totalToCollect = useRecoilValue(totalToCollectState(id))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleToggleAll = useRecoilCallback(
    ({ set, snapshot }) =>
      () => {
        const onlyThoseNotYetApprovedByHr = Array.from(credits.values()).filter(
          (credit) => {
            const nextPayment = credit.payments.find(
              (payment) => !payment.paidAt,
            )
            return !nextPayment?.hrConfirmedAt
          },
        )

        const areAllPressed = onlyThoseNotYetApprovedByHr.every(({ id }) =>
          snapshot.getLoadable(creditPressed(id)).getValue(),
        )

        const newState = !areAllPressed // Toggle the state

        for (const { id } of onlyThoseNotYetApprovedByHr) {
          set(creditPressed(id), newState)
        }
      },
    [credits],
  )

  return (
    <>
      {isModalOpen ? (
        <ConfirmPaymentModal onClose={handleCloseModal} id={id} />
      ) : null}
      <ListContainer>
        <ListHeader>
          <div className="flex gap-2 items-center">
            <label
              className="flex active:ring-2 ring-black rounded"
              htmlFor={"select-all-credits"}
            >
              <input
                tabIndex={0}
                id={"select-all-credits"}
                type="checkbox"
                checked={
                  selectedState === "fully" || selectedState === "partial"
                }
                onChange={handleToggleAll}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleToggleAll()
                  }
                }}
                className="[&:indeterminate]::before:block [&:indeterminate]::before:absolute [&:indeterminate]::before:top-1/2 [&:indeterminate]::before:left-1/2 [&:indeterminate]::before:transform [&:indeterminate]::before:-translate-x-1/2 [&:indeterminate]::before:-translate-y-1/2 [&:indeterminate]::before:w-2.5 [&:indeterminate]::before:h-0.5 [&:indeterminate]::before:bg-black rounded h-4 w-4 cursor-pointer bg-white border-indigo-300 text-indigo-600 focus:ring-indigo-200"
                ref={(input) => {
                  if (input) {
                    input.indeterminate = selectedState === "partial"
                  }
                }}
              />
            </label>
            <ListHeader.Title text={`Cobranza - ${company?.name}`} />
          </div>
          <ListHeader.Actions>
            <p className="text-sm text-gray-800 font-bold">
              {MXNFormat.format(totalToCollect)} MXN por cobrar
            </p>
            <Button onClick={handleOpenModal} size="sm" status="primary">
              Confirmar Descuentos
              <CheckIcon className="h-4 w-4 ml-1" />
            </Button>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
        {credits.size === 0 && <EmptyList />}
        <List>
          {Array.from(credits).map(([id, credit]) => (
            <ListItem key={id} credit={credit} />
          ))}
        </List>
      </ListContainer>
      {/* activity */}
      <ActivityContainer
        notificationTypes={["DispersedCredit", "AuthorizedCredit"]}
        to={"/dashboard/dispersions"}
      />
    </>
  )
}

interface ConfirmPaymentModalProps {
  onClose: () => void
  id: string
}

const ConfirmPaymentModal = ({ onClose, id }: ConfirmPaymentModalProps) => {
  const totalToCollect = useRecoilValue(totalToCollectState(id))

  const handleConfirm = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const api = await snapshot.getPromise(apiSelector)
        const credits = await snapshot.getPromise(selectedCreditsSelector(id))

        for (const credit of credits) {
          const paymentIds = new Set<string>()
          for (const payment of credit.payments) {
            // if payment is not paid and delayed add it to the set
            if (
              !payment.paidAt &&
              !!payment.expectedAt &&
              new Date(payment.expectedAt) < new Date()
            ) {
              paymentIds.add(payment.id)
            }
          }
          // add next payment to the set
          const nextPayment = credit.payments
            .toSorted((a, b) => a.number - b.number)
            .find((payment) => !payment.paidAt)

          if (nextPayment) {
            paymentIds.add(nextPayment.id)
          }

          // update payments using expected amount
          for (const paymentId of paymentIds) {
            await api.update("payments", {
              id: paymentId,
              hrConfirmedAt: new Date().toISOString(),
            })
          }
        }
        window.location.reload()
      },
    [id],
  )

  return (
    <Modal>
      <Modal.Header title="Confirmar descuentos" onClose={onClose} />
      <Modal.Body>
        <div className="p-4">
          <p className="text-gray-800 text-sm mb-4">
            ¿Estás seguro que deseas confirmar los descuentos seleccionados? Se
            cobrará un total de <b>{MXNFormat.format(totalToCollect)} MXN.</b>
          </p>
          <div className="flex justify-end gap-2">
            <Button status="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button status="primary" onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default Screen

import { useMemo, useState } from "react"

import List from "components/atoms/list"

import { MXNFormat } from "../../constants"

import type { CreditDetailed } from "./atoms"
import { paymentOnTime } from "../company-installations/utils"
import Button from "components/atoms/button"
import { useParams } from "react-router-dom"
import Modal from "components/molecules/modal"
import Input from "components/atoms/input"
import Tooltip from "components/atoms/tooltip"
import usePaymentActions from "./actions"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid"
import { useRecoilValue } from "recoil"
import { isUserAdminSelector } from "components/providers/auth/atoms"

interface ListItemProps {
  payment?: CreditDetailed["payments"][number]
  number: number
  employeeSalaryFrequency: "biweekly" | "monthly"
  installationDate: string
  amortization: number
}

const ListItem = ({
  payment,
  number,
  employeeSalaryFrequency,
  installationDate,
  amortization,
}: ListItemProps) => {
  const isAdmin = useRecoilValue(isUserAdminSelector)
  const paidAt = payment?.paidAt
  const paymentStatus = useMemo(
    () =>
      paymentOnTime({
        paymentNumber: number,
        installationDate,
        employeeSalaryFrequency,
        paidAt,
      }),
    [number, installationDate, employeeSalaryFrequency, paidAt],
  )

  return (
    <List.Item>
      <div className="min-w-56">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Pago #{number}
              </span>
              <span className="text-gray-400">/</span>
              <span className="whitespace-nowrap">
                Para el {paymentStatus.expectedPaymentDate.toLocaleDateString()}
              </span>
            </a>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
          {payment ? (
            paymentStatus.onTime ? (
              <p className="whitespace-nowrap">
                Pagado el <b>{new Date(payment.paidAt).toLocaleDateString()}</b>
              </p>
            ) : (
              <p className="text-red-600 whitespace-nowrap">
                Pagado tarde el{" "}
                <b>{new Date(payment.paidAt).toLocaleDateString()}</b>
              </p>
            )
          ) : paymentStatus.onTime ? (
            <p className="whitespace-nowrap">Pendiente</p>
          ) : (
            <p className="text-red-600 whitespace-nowrap">Demorado</p>
          )}
        </div>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Pago
              </span>
            </a>
          </h2>
        </div>
        <p className="whitespace-nowrap mt-2 font-semibold">
          {payment ? `${MXNFormat.format(payment.amount)} MXN` : "Sin pago"}
        </p>
      </div>
      <div className="flex-1 flex justify-end self-center">
        {payment ? (
          isAdmin ? (
            <DeletePayment
              id={payment.id}
              number={number}
              amount={payment.amount}
              paidAt={payment.paidAt}
            />
          ) : null
        ) : (
          <NewPayment number={number} initialAmount={amortization} />
        )}
      </div>
    </List.Item>
  )
}

interface NewPaymentProps {
  number: number
  initialAmount: number
}

interface DeletePaymentProps {
  number: number
  amount: number
  paidAt: string
  id: string
}

const DeletePayment = ({ number, amount, paidAt, id }: DeletePaymentProps) => {
  const { id: creditId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { deletePayment, deletePaymentFromCredit } = usePaymentActions()
  const open = () => setIsModalOpen(true)
  const close = () => setIsModalOpen(false)

  const handleDeletePayment = async () => {
    await deletePayment(id, creditId!)
    deletePaymentFromCredit(creditId!, id)
    close()
  }

  return (
    <>
      <Button variant="danger" onClick={open}>
        Eliminar <TrashIcon className="w-4 h-4 ml-1" />
      </Button>
      {isModalOpen && (
        <Modal>
          <Modal.Header title={"Eliminar Pago #" + number} onClose={close} />
          <Modal.Body>
            <div className="p-3">
              <p className="mb-4">
                ¿Estás seguro que deseas eliminar el pago de{" "}
                <b>${amount} MXN</b> realizado el{" "}
                <b>{new Date(paidAt).toLocaleDateString()}</b>?
              </p>
              <Button fullWidth variant="danger" onClick={handleDeletePayment}>
                Eliminar <TrashIcon className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

const NewPayment = ({ number, initialAmount }: NewPaymentProps) => {
  const { id: creditId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [amount, setAmount] = useState<number | null>(initialAmount)
  const { registerPayment, addNewPaymentToCredit } = usePaymentActions()
  const open = () => setIsModalOpen(true)
  const close = () => setIsModalOpen(false)

  const handleCreatePayment = async () => {
    const newPayment = await registerPayment(creditId!, amount!, number)
    addNewPaymentToCredit(creditId!, newPayment)
    close()
  }

  return (
    <>
      <Button onClick={open}>
        Registrar <PlusIcon className="w-4 h-4 ml-1" />
      </Button>
      {isModalOpen && (
        <Modal>
          <Modal.Header title={"Registrar Pago #" + number} onClose={close} />
          <Modal.Body>
            <div className="p-3">
              <Input
                id="amount"
                label="Cantidad"
                placeholder={`Monto estimado: $${initialAmount}`}
                type="number"
                required
                value={amount?.toString() ?? ""}
                onChange={({ target }) =>
                  setAmount(target.value === "" ? null : Number(target.value))
                }
              />
              <Tooltip
                content={
                  <>
                    El monto <b>${amount}</b> es diferente al monto estimado{" "}
                    <b>${initialAmount}</b>
                  </>
                }
                cond={amount !== initialAmount}
              >
                <Button
                  fullWidth
                  disabled={!amount}
                  onClick={handleCreatePayment}
                >
                  Registrar <PlusIcon className="w-4 h-4 ml-1" />
                </Button>
              </Tooltip>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

export default ListItem

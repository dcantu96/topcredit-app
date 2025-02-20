import { useMemo, useState } from "react"

import List from "components/atoms/list"

import { MXNFormat } from "../../constants"

import type { CreditDetailed } from "./atoms"
import Button from "components/atoms/button"
import { useParams } from "react-router-dom"
import Modal from "components/molecules/modal"
import usePaymentActions from "./actions"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useRecoilValue } from "recoil"
import { isUserAdminSelector } from "components/providers/auth/atoms"
import dayjs from "dayjs"
import Input from "components/atoms/input"
import Tooltip from "components/atoms/tooltip"

interface ListItemProps {
  payment: CreditDetailed["payments"][number]
}

const ListItem = ({ payment }: ListItemProps) => {
  const isAdmin = useRecoilValue(isUserAdminSelector)
  const isPaid = Boolean(payment.paidAt)
  const isDelayed = useMemo(() => {
    if (!payment.paidAt) {
      return dayjs().isAfter(dayjs(payment.expectedAt))
    } else {
      return dayjs(payment.paidAt).isAfter(dayjs(payment.expectedAt))
    }
  }, [payment.paidAt, payment.expectedAt])

  return (
    <List.Item>
      <div className="min-w-56">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Pago #{payment.number}
              </span>
              <span className="text-gray-400">/</span>
              <span className="whitespace-nowrap">
                Para el {dayjs(payment.expectedAt).locale("es").format("LL")}
              </span>
            </a>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
          {isPaid ? (
            isDelayed ? (
              <p className="text-red-600 whitespace-nowrap">
                Pagado tarde el{" "}
                <b>{dayjs(payment.paidAt).locale("es").format("LL")}</b>
              </p>
            ) : (
              <p className="whitespace-nowrap">
                Pagado el{" "}
                <b>{dayjs(payment.paidAt).locale("es").format("LL")}</b>
              </p>
            )
          ) : isDelayed ? (
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
      {isAdmin && (
        <div className="flex-1 flex justify-end self-center">
          <UpdatePayment
            id={payment.id}
            number={payment.number}
            amount={payment.amount}
            expectedAmount={payment.expectedAmount}
          />
        </div>
      )}
    </List.Item>
  )
}

interface UpdatePaymentProps {
  id: string
  number: number | null
  amount: number
  expectedAmount: number
}

const UpdatePayment = ({
  number,
  amount,
  id,
  expectedAmount,
}: UpdatePaymentProps) => {
  const { id: creditId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAmount, setNewAmount] = useState<number | null>(amount)
  const { updatePayment, updatePaymentFromCredit } = usePaymentActions()
  const open = () => setIsModalOpen(true)
  const close = () => setIsModalOpen(false)

  const handleUpdatePayment = async () => {
    const updatedPayment = await updatePayment(id, newAmount!, creditId!)
    updatePaymentFromCredit(creditId!, updatedPayment)
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
                placeholder={`Monto estimado: $${expectedAmount}`}
                type="number"
                required
                value={amount?.toString() ?? ""}
                onChange={({ target }) =>
                  setNewAmount(
                    target.value === "" ? null : Number(target.value),
                  )
                }
              />
              <Tooltip
                content={
                  <>
                    El monto <b>${newAmount}</b> es diferente al monto estimado{" "}
                    <b>${expectedAmount}</b>
                  </>
                }
                cond={newAmount !== expectedAmount}
              >
                <Button
                  fullWidth
                  disabled={!newAmount}
                  onClick={handleUpdatePayment}
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

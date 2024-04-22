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
  companyCreditsDetailedWithPaymentsState,
  installedCreditWithPaymentSelectedState,
  selectedInstalledCreditWithPaymentsIdsState,
} from "./atoms"
import { useState } from "react"
import Dialog from "components/molecules/dialog"
import { fetchNextPayrollDate } from "../company-installations/utils"
import { useGetCreditAmortization } from "hooks/useCreditAmortization/useCreditAmortization"

interface BulkActionsButtonProps {
  companyId: string
}

const BulkActionsButton = ({ companyId }: BulkActionsButtonProps) => {
  const callback = useGetCreditAmortization()
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedCredits = useRecoilValue(
    selectedInstalledCreditWithPaymentsIdsState(companyId),
  )
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleRegisterPayments = useRecoilCallback(
    ({ snapshot, set, reset }) =>
      async () => {
        const api = await snapshot.getPromise(apiSelector)
        const credits = await snapshot.getPromise(
          companyCreditsDetailedWithPaymentsState(companyId),
        )
        const selectedCredits = await snapshot.getPromise(
          selectedInstalledCreditWithPaymentsIdsState(companyId),
        )

        for (const creditId of selectedCredits) {
          const credit = credits?.find((credit) => credit.id === creditId)
          if (!credit) continue
          const amortization = callback({
            loan: credit.loan ?? undefined,
            rate: credit.termOffering.company.rate,
            duration: credit.termOffering.term.duration,
            durationType: credit.termOffering.term.durationType,
          })
          if (!amortization) continue
          const resp = await api.create("payments", {
            credit: {
              data: {
                id: creditId,
                type: "credits",
              },
            },
            amount: amortization,
            paidAt: new Date().toISOString(),
          })
          reset(installedCreditWithPaymentSelectedState(creditId))
          set(
            companyCreditsDetailedWithPaymentsState(companyId),
            (oldCredits) => {
              return (
                oldCredits?.map((credit) => {
                  if (credit.id === creditId) {
                    return {
                      ...credit,
                      payments: [
                        ...credit.payments,
                        {
                          id: resp.data.id,
                          amount: resp.data.amount,
                          paidAt: resp.data.paidAt,
                        },
                      ],
                    }
                  } else {
                    return credit
                  }
                }) ?? []
              )
            },
          )
        }

        toast.success({
          title: "Pagos registrados",
          message: "se han instalado los créditos seleccionados",
        })
        closeModal()
      },
    [companyId],
  )

  const modalMessage = `Esto registrará el pago para ${selectedCredits.length} créditos. ¿Estás seguro? Una vez instalados no podrás deshacer esta acción.`

  if (!selectedCredits.length) return null
  return (
    <>
      <Button size="sm" onClick={openModal}>
        Registrar pagos ({selectedCredits.length})
      </Button>
      {isModalOpen ? (
        <Dialog
          message={modalMessage}
          onCancel={closeModal}
          onClose={async (input) => {
            if (input === "registrar") await handleRegisterPayments()
          }}
          title="Registrar pagos"
          inputLabel="Escribe 'registrar' para confirmar"
          type="danger"
        />
      ) : null}
    </>
  )
}

const Screen = () => {
  const { companyId } = useParams()
  const company = useRecoilValue(companySelectorQuery(companyId!))
  const credits = useRecoilValue(
    companyCreditsDetailedWithPaymentsState(companyId),
  )
  const nextPayrollDate = fetchNextPayrollDate(
    company.employeeSalaryFrequency,
  ).toLocaleDateString()

  if (!credits) return null

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Cobranza" to={".."}>
            / <ListHeader.Title text={company.name} />
          </ListHeader.Title>
          <ListHeader.Actions>
            <h3 className="text-sm">
              Proxima Nómina <b>{nextPayrollDate}</b>
            </h3>
            <BulkActionsButton companyId={companyId!} />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {credits.map((credit) => (
            <CreditListItem
              key={credit.id}
              credit={credit}
              employeeSalaryFrequency={company.employeeSalaryFrequency}
              termDuration={credit.termOffering.term.duration}
            />
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

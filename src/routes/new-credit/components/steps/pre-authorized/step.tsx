import FileField from "components/atoms/file-field"
import Button from "components/atoms/button"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { userLatestCreditSelectorQuery } from "../../../atoms"
import { MXNFormat } from "../../../../../constants"
import {
  creditAuthorizationState,
  creditContractState,
  creditPayrollReceiptState,
  readonlyCreditAuthorizationSelector,
  readonlyCreditContractSelector,
  readonlyCreditPayrollReceiptSelector,
} from "./atoms"
import { useSubmitCredit } from "./actions"
import Notice from "components/atoms/notice"
import { useState } from "react"
import SuccessAnimation from "components/atoms/success-animation"

type AnimationStatus = "pending" | "running" | "finished"

const Step = () => {
  const [animationStatus, setAnimationStatus] =
    useState<AnimationStatus>("pending")
  const credit = useRecoilValue(userLatestCreditSelectorQuery)
  const setPayrollReceipt = useSetRecoilState(creditPayrollReceiptState)
  const payrollReceipt = useRecoilValue(readonlyCreditPayrollReceiptSelector)
  const setContract = useSetRecoilState(creditContractState)
  const contract = useRecoilValue(readonlyCreditContractSelector)
  const setAuthorization = useSetRecoilState(creditAuthorizationState)
  const authorization = useRecoilValue(readonlyCreditAuthorizationSelector)
  const { submit } = useSubmitCredit()

  const animate = () => {
    setAnimationStatus("running")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await submit(animate)
  }

  const isSubmitDisabled =
    credit?.status === "pending" ||
    credit?.status === "authorized" ||
    credit?.status === "denied"

  const isWaiting = credit?.status === "pending"

  const isAuthorized =
    credit?.status === "authorized" || credit?.status === "dispersed"

  return (
    <>
      {animationStatus === "running" && (
        <SuccessAnimation onCompleted={() => setAnimationStatus("finished")} />
      )}
      <form className="p-4 max-w-screen-md" onSubmit={handleSubmit}>
        <h1 className="text-gray-900 font-bold text-3xl">Pre Autorización</h1>

        <p className="mt-1 text-lg leading-6 text-gray-600 mb-2">
          ¡Felicidades! Fuiste pre autorizado por un monto de{" "}
          <b>{MXNFormat.format(credit?.loan || 0)}</b>
        </p>
        {credit?.status === "new" ? (
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Necesitamos unos documentos para poder continuar con el proceso.
          </p>
        ) : credit?.status === "pending" ? (
          <Notice
            color="primary"
            title="Procesando"
            description="Estamos procesando tus datos. Pronto te notificaremos si autorizamos
            tu crédito."
          />
        ) : credit?.status === "invalid-documentation" ? (
          <Notice
            color="error"
            title="Documentación inválida"
            description="Hay un problema con tus documentos, dejamos más información abajo."
          />
        ) : credit?.status === "authorized" ? (
          <Notice
            color="success"
            title="Autorizado"
            description="¡Felicidades! Tu crédito ha sido autorizado."
          />
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-8">
          <div className="col-span-full">
            <FileField
              id="payment-receipt"
              label="Recibo de Nómina"
              initialFile={payrollReceipt}
              error={credit?.payrollReceiptRejectionReason ?? undefined}
              onRemove={() => setPayrollReceipt(null)}
              disableRemove={isWaiting || isAuthorized}
              handleFileUpload={({ signedId }) => {
                if (!signedId) return
                setPayrollReceipt(signedId)
              }}
            />
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">
              Te enviaremos un correo con donde podrás descargar y firmar el{" "}
              <b>contrato</b> asi como la <b>carta de autorización.</b> Una vez
              firmados los documentos, deberás subirlos aquí.
            </p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <FileField
              id="contract"
              label="Contrato"
              initialFile={contract}
              error={credit?.contractRejectionReason ?? undefined}
              onRemove={() => setContract(null)}
              disableRemove={isWaiting || isAuthorized}
              handleFileUpload={({ signedId }) => {
                if (!signedId) return
                setContract(signedId)
              }}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FileField
              id="authorization-letter"
              label="Carta de Autorización"
              initialFile={authorization}
              error={credit?.authorizationRejectionReason ?? undefined}
              disableRemove={isWaiting || isAuthorized}
              onRemove={() => setAuthorization(null)}
              handleFileUpload={({ signedId }) => {
                if (!signedId) return
                setAuthorization(signedId)
              }}
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button status="secondary" type="button">
            Cancelar
          </Button>
          <Button size="md" type="submit" disabled={isSubmitDisabled}>
            Enviar
          </Button>
        </div>
      </form>
    </>
  )
}

export default Step

import FileField from "components/atoms/file-field"
import Button from "components/atoms/button"
import FileViewer from "components/atoms/file-viewer"
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
import { InformationCircleIcon } from "@heroicons/react/24/outline"

const Step = () => {
  const credit = useRecoilValue(userLatestCreditSelectorQuery)
  const setPayrollReceipt = useSetRecoilState(creditPayrollReceiptState)
  const payrollReceipt = useRecoilValue(readonlyCreditPayrollReceiptSelector)
  const setContract = useSetRecoilState(creditContractState)
  const contract = useRecoilValue(readonlyCreditContractSelector)
  const setAuthorization = useSetRecoilState(creditAuthorizationState)
  const authorization = useRecoilValue(readonlyCreditAuthorizationSelector)
  const { submit } = useSubmitCredit()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submit()
  }

  const isSubmitDisabled =
    credit?.status === "pending" ||
    credit?.status === "authorized" ||
    credit?.status === "denied"

  return (
    <form className="p-4 max-w-screen-md" onSubmit={handleSubmit}>
      <h1 className="text-gray-900 font-bold text-3xl">Pre Autorización</h1>

      <p className="mt-1 text-lg leading-6 text-gray-600">
        ¡Felicidades! Fuiste pre autorizado por un monto de{" "}
        <b>{MXNFormat.format(credit?.loan || 0)}</b>
      </p>
      {credit?.status === "new" ? (
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Necesitamos unos documentos para poder continuar con el proceso.
        </p>
      ) : credit?.status === "pending" ? (
        <div className="mt-2 rounded-md border-2 border-dashed border-indigo-600 p-2 inline-flex">
          <InformationCircleIcon className="h-6 w-6 text-indigo-600 mr-2" />
          Estamos procesando tus datos. Pronto te notificaremos si autorizamos
          tu crédito.
        </div>
      ) : credit?.status === "invalid-documentation" ? (
        <div className="mt-2 rounded-md border-2 border-dashed border-rose-600 p-2 inline-flex">
          <InformationCircleIcon className="h-6 w-6 text-rose-600 mr-2" />
          Hay un problema con tus documentos, {credit.reason}
        </div>
      ) : credit?.status === "authorized" ? (
        <div className="mt-2 rounded-md border-2 border-dashed border-green-600 p-2 inline-flex">
          <InformationCircleIcon className="h-6 w-6 text-green-600 mr-2" />
          ¡Felicidades! Tu crédito ha sido autorizado.
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8">
        <div className="col-span-full">
          <FileField
            id="payment-receipt"
            label="Recibo de Nómina"
            initialFile={payrollReceipt}
            onRemove={() => setPayrollReceipt(null)}
            handleFileUpload={({ signedId }) => {
              if (!signedId) return
              setPayrollReceipt(signedId)
            }}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <FileField
            id="contract"
            label="Contrato"
            initialFile={contract}
            onRemove={() => setContract(null)}
            handleFileUpload={({ signedId }) => {
              if (!signedId) return
              setContract(signedId)
            }}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <FileViewer
            label="Contrato"
            fileName="contrato.pdf"
            fileDate="Sat Feb 25"
            fileSize="1.9MB"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <FileField
            id="authorization-letter"
            label="Carta de Autorización"
            initialFile={authorization}
            onRemove={() => setAuthorization(null)}
            handleFileUpload={({ signedId }) => {
              if (!signedId) return
              setAuthorization(signedId)
            }}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <FileViewer
            label="Carta de Autorización"
            fileName="carta_aut.pdf"
            fileDate="Sat Feb 25"
            fileSize="1.9MB"
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
  )
}

export default Step

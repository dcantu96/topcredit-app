import Input from "components/atoms/input"
import FileField from "components/atoms/file-field"
import Button from "components/atoms/button"
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil"
import {
  editableAddressLineOneFieldState,
  editableAddressLineTwoFieldState,
  editableBankAccountNumberFieldState,
  editableCityFieldState,
  editableEmployeeNumberFieldState,
  editablePostalCodeFieldState,
  editableStateFieldState,
  postalCodeFieldErrorsSelector,
  bankAccountNumberFieldErrorsSelector,
  editableRFCFieldState,
  bankAccountNumberFieldTouchedState,
  RFCFieldTouchedState,
  RFCFieldErrorsSelector,
  postalCodeFieldTouchedState,
  editableSalaryFieldState,
  salaryFieldTouchedState,
  salaryFieldErrorsSelector,
  editableIdentityDocumentFieldState,
  readonlyIdentityDocumentSelector,
  editableBankStatementFieldState,
  editablePayrollReceiptFieldState,
  editableProofOfAddressFieldState,
  readonlyBankStatementSelector,
  readonlyPayrollReceiptSelector,
  readonlyProofOfAddressSelector,
  editableCountryFieldState,
} from "./atoms"
import Select from "components/atoms/select"

import { useCreditScreenSubmitActions } from "./actions"
import {
  COUNTRIES,
  SALARY_FREQUENCIES,
  STATES_OF_MEXICO,
} from "../../../../../constants"
import { userGeneralDataQuerySelector } from "../../../atoms"
import { companiesDataSelector } from "../../../../companies/loader"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import Dialog from "components/molecules/dialog"
import Notice from "components/atoms/notice"

const Step = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const setBankAccountNumberTouched = useSetRecoilState(
    bankAccountNumberFieldTouchedState,
  )
  const setPostalCodeTouched = useSetRecoilState(postalCodeFieldTouchedState)
  const setRFCTouched = useSetRecoilState(RFCFieldTouchedState)
  const rfcError = useRecoilValue(RFCFieldErrorsSelector)
  const { submit } = useCreditScreenSubmitActions()
  const postalCodeError = useRecoilValue(postalCodeFieldErrorsSelector)
  const bankAccountNumberError = useRecoilValue(
    bankAccountNumberFieldErrorsSelector,
  )
  const [employeeNumber, setEmployeeNumber] = useRecoilState(
    editableEmployeeNumberFieldState,
  )
  const [bankAccountNumber, setBankAccountNumber] = useRecoilState(
    editableBankAccountNumberFieldState,
  )
  const [addressLineOne, setAddressLineOne] = useRecoilState(
    editableAddressLineOneFieldState,
  )
  const [addressLineTwo, setAddressLineTwo] = useRecoilState(
    editableAddressLineTwoFieldState,
  )
  const [city, setCity] = useRecoilState(editableCityFieldState)
  const [state, setState] = useRecoilState(editableStateFieldState)
  const [postalCode, setPostalCode] = useRecoilState(
    editablePostalCodeFieldState,
  )
  const [rfc, setRfc] = useRecoilState(editableRFCFieldState)
  const [country, setCountry] = useRecoilState(editableCountryFieldState)
  const salaryFieldError = useRecoilValue(salaryFieldErrorsSelector)
  const refreshUser = useRecoilRefresher_UNSTABLE(userGeneralDataQuerySelector)
  const user = useRecoilValue(userGeneralDataQuerySelector)
  const companies = useRecoilValue(
    companiesDataSelector({
      filter: {
        domain: user?.email.split("@")[1],
      },
    }),
  )
  const companySalaryFrequency = companies?.[0]?.employeeSalaryFrequency
  const mappedFreq = companySalaryFrequency === "biweekly" ? "Q" : "M"
  const storedIdentityDocument = useRecoilValue(
    readonlyIdentityDocumentSelector,
  )
  const [identityDocumentId, setIdentityDocument] = useRecoilState(
    editableIdentityDocumentFieldState,
  )
  const [bankStatementId, setBankStatement] = useRecoilState(
    editableBankStatementFieldState,
  )
  const [payrollReceiptId, setPayrollReceipt] = useRecoilState(
    editablePayrollReceiptFieldState,
  )
  const [proofOfAddressId, setProofOfAddress] = useRecoilState(
    editableProofOfAddressFieldState,
  )
  const storedBankStatement = useRecoilValue(readonlyBankStatementSelector)
  const storedPayrollReceipt = useRecoilValue(readonlyPayrollReceiptSelector)
  const storedProofOfAddress = useRecoilValue(readonlyProofOfAddressSelector)
  const bankStatementStatus = user?.bankStatementStatus
  const bankStatementRejectionReason = user?.bankStatementRejectionReason
  const payrollReceiptStatus = user?.payrollReceiptStatus
  const payrollReceiptRejectionReason = user?.payrollReceiptRejectionReason
  const proofOfAddressStatus = user?.proofOfAddressStatus
  const proofOfAddressRejectionReason = user?.proofOfAddressRejectionReason
  const identityDocumentStatus = user?.identityDocumentStatus
  const identityDocumentRejectionReason = user?.identityDocumentRejectionReason

  console
  const closeModal = () => setIsModalOpen(false)
  const openModal = () => setIsModalOpen(true)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submit()
    openModal()
  }

  const handleClose = () => {
    refreshUser()
    closeModal()
  }

  const [salary, setSalary] = useRecoilState(editableSalaryFieldState)
  const setSalaryTouched = useSetRecoilState(salaryFieldTouchedState)

  const isWaiting =
    user?.status === "pending" || user?.status === "pre-authorization"

  const anyFieldEmpty =
    employeeNumber === "" ||
    bankAccountNumber === "" ||
    addressLineOne === "" ||
    city === "" ||
    state === null ||
    postalCode === "" ||
    rfc === "" ||
    salary === ""

  const anyDocumentEmpty =
    (!storedIdentityDocument && !identityDocumentId) ||
    (!storedBankStatement && !bankStatementId) ||
    (!storedPayrollReceipt && !payrollReceiptId) ||
    (!storedProofOfAddress && !proofOfAddressId)

  const isInvalidDocumentation = user?.status === "invalid-documentation"

  return (
    <>
      <form className="p-4 max-w-screen-md" onSubmit={handleSubmit}>
        <h1 className="text-gray-900 font-bold text-3xl mb-2">
          Datos Generales
        </h1>
        {isWaiting ? (
          <Notice
            color="primary"
            title="Procesando"
            description="Estamos procesando tus datos. Pronto te notificaremos si tu solicitud fue pre aprobada."
          />
        ) : isInvalidDocumentation ? (
          <Notice
            color="error"
            title="Documentación inválida"
            description="Hay un problema con tus documentos, dejamos mas información abajo."
          />
        ) : null}
        <div className="mt-8 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
          <div className="col-span-full">
            <div className="flex items-center gap-2">
              <Input
                id="salary"
                label={`¿Cual es tu salario en ${companies?.[0]?.name}?`}
                required
                value={salary}
                prefix="$"
                type="money"
                disabled={isWaiting}
                error={salaryFieldError}
                trailingDropdownLabel="MXN"
                trailingDropdownOptions={[{ value: "MXN", label: "MXN" }]}
                trailingDropdownId="salary-currency"
                onBlur={() => setSalaryTouched(true)}
                onChange={(e) => setSalary(e.target.value)}
              />
              {Array.from(SALARY_FREQUENCIES.entries()).map(
                ([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    disabled
                    status={mappedFreq === value ? "primary" : "secondary"}
                  >
                    {label}
                  </Button>
                ),
              )}
            </div>
          </div>
          <div className="col-span-full lg:col-span-4">
            <Input
              id="payroll"
              label="Numero de Nómina"
              required
              value={employeeNumber}
              disabled={isWaiting}
              onChange={(e) => setEmployeeNumber(e.target.value)}
            />
          </div>
          <div className="col-span-full lg:col-span-4">
            <Input
              id="rfc"
              label="RFC"
              required
              maxLength={13}
              error={rfcError}
              value={rfc}
              onBlur={() => setRFCTouched(true)}
              disabled={isWaiting}
              onChange={(e) => setRfc(e.target.value)}
            />
          </div>
          <div className="col-span-full">
            <Input
              id="bank-account-number"
              label="CLABE Interbancaria"
              placeholder="18 dígitos"
              onBlur={() => setBankAccountNumberTouched(true)}
              required
              maxLength={18}
              error={bankAccountNumberError}
              value={bankAccountNumber}
              disabled={isWaiting}
              onChange={(e) => setBankAccountNumber(e.target.value)}
            />
          </div>
          <div className="col-span-full lg:col-span-3">
            <Input
              id="address-line-one"
              label="Calle y numero"
              required
              value={addressLineOne}
              disabled={isWaiting}
              onChange={(e) => setAddressLineOne(e.target.value)}
            />
          </div>
          <div className="col-span-full lg:col-span-3">
            <Input
              id="address-line-two"
              label="Numero interior"
              placeholder="1206 Torre 4"
              value={addressLineTwo}
              disabled={isWaiting}
              onChange={(e) => setAddressLineTwo(e.target.value)}
            />
          </div>
          <div className="col-span-full lg:col-span-3">
            <Input
              id="city"
              label="Ciudad"
              value={city}
              disabled={isWaiting}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="col-span-full lg:col-span-3">
            <Select
              id="state"
              label="Estado"
              disabled={isWaiting}
              value={state ?? undefined}
              required
              onChange={(newValue) => setState(newValue ?? null)}
              options={STATES_OF_MEXICO}
            />
          </div>
          <div className="col-span-full lg:col-span-3">
            <Select
              id="country"
              label="País"
              disabled={isWaiting}
              value={country}
              required
              onChange={(newValue) => setCountry(newValue ?? "MX")}
              options={COUNTRIES}
            />
          </div>
          <div className="col-span-full lg:col-span-3">
            <Input
              disabled={isWaiting}
              id="postal-code"
              label="Código Postal"
              maxLength={5}
              required
              error={postalCodeError}
              value={postalCode}
              onBlur={() => setPostalCodeTouched(true)}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="col-span-full">
            <h1 className="text-gray-900 font-bold text-3xl">Documentación</h1>
          </div>
          <div className="col-span-full mb-4">
            <FileField
              required
              id="official-identification"
              label="Identificación oficial"
              description="Unicamente INE o Pasaporte"
              disableRemove={isWaiting || identityDocumentStatus === "approved"}
              initialFile={storedIdentityDocument}
              error={
                identityDocumentStatus === "rejected" && !identityDocumentId
                  ? identityDocumentRejectionReason ?? "Documento rechazado"
                  : undefined
              }
              onRemove={() => setIdentityDocument(null)}
              handleFileUpload={({ signedId }) => {
                if (!signedId) return
                setIdentityDocument(signedId)
              }}
            />
          </div>
          <div className="col-span-full mb-4">
            <FileField
              required
              id="proof-of-address"
              label="Comprobante de Domicilio"
              description="Antigüedad no mayor a 3 meses."
              disableRemove={isWaiting || proofOfAddressStatus === "approved"}
              onRemove={() => setProofOfAddress(null)}
              error={
                proofOfAddressStatus === "rejected" && !proofOfAddressId
                  ? proofOfAddressRejectionReason ?? "Documento rechazado"
                  : undefined
              }
              initialFile={storedProofOfAddress}
              handleFileUpload={({ signedId }) => {
                if (!signedId) return
                setProofOfAddress(signedId)
              }}
            />
          </div>
          <div className="col-span-full mb-4">
            <FileField
              required
              id="cover"
              label="Estado de Cuenta Bancario"
              description="Antigüedad no mayor a 3 meses."
              disableRemove={isWaiting || bankStatementStatus === "approved"}
              initialFile={storedBankStatement}
              error={
                bankStatementStatus === "rejected" && !bankStatementId
                  ? bankStatementRejectionReason ?? "Documento rechazado"
                  : undefined
              }
              onRemove={() => setBankStatement(null)}
              handleFileUpload={({ signedId }) => {
                if (!signedId) return
                setBankStatement(signedId)
              }}
            />
          </div>
          <div className="col-span-full mb-4">
            <FileField
              required
              id="payroll-receipt"
              label="Recibo de Nomina"
              description="Antigüedad no mayor a 1 mes."
              disableRemove={isWaiting || payrollReceiptStatus === "approved"}
              initialFile={storedPayrollReceipt}
              error={
                payrollReceiptStatus === "rejected" && !payrollReceiptId
                  ? payrollReceiptRejectionReason ?? "Documento rechazado"
                  : undefined
              }
              onRemove={() => setPayrollReceipt(null)}
              handleFileUpload={({ signedId }) => {
                if (!signedId) return
                setPayrollReceipt(signedId)
              }}
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            size="md"
            type="submit"
            disabled={isWaiting || anyFieldEmpty || anyDocumentEmpty}
          >
            Enviar
          </Button>
        </div>
      </form>
      <AnimatePresence>
        {isModalOpen && (
          <Dialog
            onClose={handleClose}
            type="notice"
            title="Listo"
            message="Hemos recibido tu solicitud. Pronto te notificaremos si fue pre aprobada."
            confirmText="Aceptar"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Step

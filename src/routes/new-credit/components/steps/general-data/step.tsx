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
  editableSalaryFrequencyFieldState,
  salaryFrequencyFieldTouchedState,
  editableSalaryFieldState,
  salaryFieldTouchedState,
  salaryFieldErrorsSelector,
  salaryFrequencyFieldErrorsSelector,
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
import { InformationCircleIcon } from "@heroicons/react/24/outline"

const Step = () => {
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
  const [salaryFrequency, setSalaryFrequency] = useRecoilState(
    editableSalaryFrequencyFieldState,
  )
  const setSalaryFrequencyTouched = useSetRecoilState(
    salaryFrequencyFieldTouchedState,
  )
  const salaryFieldError = useRecoilValue(salaryFieldErrorsSelector)
  const salaryFrequencyFieldError = useRecoilValue(
    salaryFrequencyFieldErrorsSelector,
  )
  const refreshUser = useRecoilRefresher_UNSTABLE(userGeneralDataQuerySelector)
  const user = useRecoilValue(userGeneralDataQuerySelector)
  const storedIdentityDocument = useRecoilValue(
    readonlyIdentityDocumentSelector,
  )
  const setIdentityDocument = useSetRecoilState(
    editableIdentityDocumentFieldState,
  )
  const setBankStatement = useSetRecoilState(editableBankStatementFieldState)
  const setPayrollReceipt = useSetRecoilState(editablePayrollReceiptFieldState)
  const setProofOfAddress = useSetRecoilState(editableProofOfAddressFieldState)
  const storedBankStatement = useRecoilValue(readonlyBankStatementSelector)
  const storedPayrollReceipt = useRecoilValue(readonlyPayrollReceiptSelector)
  const storedProofOfAddress = useRecoilValue(readonlyProofOfAddressSelector)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submit()
    refreshUser()
  }

  const [salary, setSalary] = useRecoilState(editableSalaryFieldState)
  const setSalaryTouched = useSetRecoilState(salaryFieldTouchedState)

  const isWaiting =
    user?.status === "pending" || user?.status === "pre-authorization"

  const isInvalidDocumentation = user?.status === "invalid-documentation"

  return (
    <form className="p-4 max-w-screen-md" onSubmit={handleSubmit}>
      <h1 className="text-gray-900 font-bold text-3xl">Datos Generales</h1>
      {isWaiting ? (
        <div className="mt-2 rounded-md border-2 border-dashed border-indigo-600 p-2 inline-flex">
          <InformationCircleIcon className="h-6 w-6 text-indigo-600 mr-2" />
          Estamos procesando tus datos. Pronto te notificaremos si tu solicitud
          fue pre aprobada.
        </div>
      ) : isInvalidDocumentation ? (
        <div className="mt-2 rounded-md border-2 border-dashed border-rose-600 p-2 inline-flex">
          <InformationCircleIcon className="h-6 w-6 text-rose-600 mr-2" />
          Hay un problema con tus documentos: <b>{user.reason}</b> Por favor
          vuelve a subirlos.
        </div>
      ) : (
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Necesitamos algunos datos para poder procesar tu solicitud.
        </p>
      )}
      <div className="mt-10 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
        <div className="col-span-full">
          <div className="flex items-center gap-2">
            <Input
              id="salary"
              label="¿Como percibes tu sueldo?"
              required
              value={salary}
              prefix="$"
              type="money"
              disabled={isWaiting}
              error={salaryFieldError || salaryFrequencyFieldError}
              trailingDropdownLabel="MXN"
              trailingDropdownOptions={[{ value: "MXN", label: "MXN" }]}
              trailingDropdownId="salary-currency"
              onBlur={() => setSalaryTouched(true)}
              onChange={(e) => setSalary(e.target.value)}
            />
            {Array.from(SALARY_FREQUENCIES.entries()).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                disabled={isWaiting}
                status={salaryFrequency === value ? "primary" : "secondary"}
                onClick={() => {
                  setSalaryFrequency(value)
                  setSalaryFrequencyTouched(true)
                }}
              >
                {label}
              </Button>
            ))}
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
            id="official-identification"
            label="Identificación oficial"
            description="Unicamente INE o Pasaporte"
            initialFile={storedIdentityDocument}
            onRemove={() => setIdentityDocument(null)}
            handleFileUpload={({ signedId }) => {
              if (!signedId) return
              setIdentityDocument(signedId)
            }}
          />
        </div>
        <div className="col-span-full mb-4">
          <FileField
            id="proof-of-address"
            label="Comprobante de Domicilio"
            description="Antigüedad no mayor a 3 meses."
            onRemove={() => setProofOfAddress(null)}
            initialFile={storedProofOfAddress}
            handleFileUpload={({ signedId }) => {
              if (!signedId) return
              setProofOfAddress(signedId)
            }}
          />
        </div>
        <div className="col-span-full mb-4">
          <FileField
            id="cover"
            label="Estado de Cuenta Bancario"
            description="Antigüedad no mayor a 3 meses."
            initialFile={storedBankStatement}
            onRemove={() => setBankStatement(null)}
            handleFileUpload={({ signedId }) => {
              if (!signedId) return
              setBankStatement(signedId)
            }}
          />
        </div>
        <div className="col-span-full mb-4">
          <FileField
            id="payroll-receipt"
            label="Recibo de Nomina"
            description="Antigüedad no mayor a 1 mes."
            initialFile={storedPayrollReceipt}
            onRemove={() => setPayrollReceipt(null)}
            handleFileUpload={({ signedId }) => {
              if (!signedId) return
              setPayrollReceipt(signedId)
            }}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button status="secondary" type="button" disabled={isWaiting}>
          Cancelar
        </Button>
        <Button size="md" type="submit" disabled={isWaiting}>
          Enviar
        </Button>
      </div>
    </form>
  )
}

export default Step

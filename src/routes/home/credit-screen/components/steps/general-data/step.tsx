import Input from "components/atoms/input"
import FileField from "components/atoms/file-field"
import Button from "components/atoms/button"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
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
} from "./atoms"
import Select from "components/atoms/select"

import { useCreditScreenSubmitActions } from "./actions"
import { COUNTRIES, STATES_OF_MEXICO } from "../../../../../../constants"

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
  const [country, setCountry] = useRecoilState(editableCityFieldState)
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit()
  }

  const [salary, setSalary] = useRecoilState(editableSalaryFieldState)
  const setSalaryTouched = useSetRecoilState(salaryFieldTouchedState)

  const salaryFrequencyOptions = [
    { value: "Q", label: "Quincenal" },
    { value: "M", label: "Mensual" },
  ]

  console.log(salaryFrequency)

  return (
    <form className="p-4 max-w-screen-md" onSubmit={handleSubmit}>
      <h1 className="text-gray-900 font-bold text-3xl">Datos Generales</h1>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Necesitamos algunos datos para poder procesar tu solicitud.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="col-span-full">
          <div className="flex items-end gap-2">
            <Input
              id="salary"
              label="¿Como percibes tu sueldo?"
              required
              value={salary}
              prefix="$"
              type="money"
              error={salaryFieldError || salaryFrequencyFieldError}
              trailingDropdownLabel="MXN"
              trailingDropdownOptions={["MXN"]}
              trailingDropdownId="salary-currency"
              onBlur={() => setSalaryTouched(true)}
              onChange={(e) => setSalary(e.target.value)}
            />
            {salaryFrequencyOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                status={
                  salaryFrequency === option.value ? "primary" : "secondary"
                }
                onClick={() => {
                  setSalaryFrequency(option.value)
                  setSalaryFrequencyTouched(true)
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-4">
          <Input
            id="payroll"
            label="Numero de Nómina"
            required
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
          />
        </div>
        <div className="sm:col-span-4">
          <Input
            id="rfc"
            label="RFC"
            required
            maxLength={13}
            error={rfcError}
            value={rfc}
            onBlur={() => setRFCTouched(true)}
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
            onChange={(e) => setBankAccountNumber(e.target.value)}
          />
        </div>
        <div className="sm:col-span-3">
          <Input
            id="address-line-one"
            label="Calle y numero"
            required
            value={addressLineOne}
            onChange={(e) => setAddressLineOne(e.target.value)}
          />
        </div>
        <div className="sm:col-span-3">
          <Input
            id="address-line-two"
            label="Numero interior"
            placeholder="1206 Torre 4"
            value={addressLineTwo}
            onChange={(e) => setAddressLineTwo(e.target.value)}
          />
        </div>
        <div className="sm:col-span-3">
          <Input
            id="city"
            label="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            id="state"
            label="Estado"
            value={state}
            required
            onChange={(e) => setState(e.target.value)}
            options={STATES_OF_MEXICO}
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            id="country"
            label="País"
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
            options={COUNTRIES}
          />
        </div>
        <div className="sm:col-span-3">
          <Input
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
        <div className="col-span-full">
          <FileField
            id="official-identification"
            label="Identificación oficial"
            description="Unicamente INE o Pasaporte"
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files)
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files)
              }
            }}
          />
        </div>
        <div className="col-span-full">
          <FileField
            id="proof-of-address"
            label="Comprobante de Domicilio"
            description="Antigüedad no mayor a 3 meses."
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files)
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files)
              }
            }}
          />
        </div>
        <div className="col-span-full">
          <FileField
            id="cover"
            label="Estado de Cuenta Bancario"
            description="Antigüedad no mayor a 3 meses."
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files)
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files)
              }
            }}
          />
        </div>
        <div className="col-span-full">
          <FileField
            id="payroll-receipt"
            label="Recibo de Nomina"
            description="Antigüedad no mayor a 1 mes."
            handleFile={(e) => {
              if ("dataTransfer" in e && e.dataTransfer.files) {
                // Handle drag and drop files
                console.log(e.dataTransfer.files)
              } else if ("target" in e && "files" in e.target) {
                // Handle files selected through file input
                console.log(e.target.files)
              }
            }}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button status="secondary" type="button">
          Cancelar
        </Button>
        <Button size="md" type="submit">
          Enviar
        </Button>
      </div>
    </form>
  )
}

export default Step

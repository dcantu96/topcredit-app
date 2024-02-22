import { useRecoilValue } from "recoil"
import {
  editableEmployeeNumberFieldState,
  editableBankAccountNumberFieldState,
  editableAddressLineOneFieldState,
  editableAddressLineTwoFieldState,
  editableCityFieldState,
  editableStateFieldState,
  editablePostalCodeFieldState,
  editableCountryFieldState,
  editableRFCFieldState,
  editableSalaryFrequencyFieldState,
  editableSalaryFieldState,
} from "./atoms"
import { apiSelector } from "components/providers/api/atoms"
import { myProfileState } from "components/providers/auth/atoms"

export const useCreditScreenSubmitActions = () => {
  const api = useRecoilValue(apiSelector)
  const profile = useRecoilValue(myProfileState)

  // general data fields
  const employeeNumber = useRecoilValue(editableEmployeeNumberFieldState)
  const bankAccountNumber = useRecoilValue(editableBankAccountNumberFieldState)
  const addressLineOne = useRecoilValue(editableAddressLineOneFieldState)
  const addressLineTwo = useRecoilValue(editableAddressLineTwoFieldState)
  const city = useRecoilValue(editableCityFieldState)
  const state = useRecoilValue(editableStateFieldState)
  const country = useRecoilValue(editableCountryFieldState)
  const rfc = useRecoilValue(editableRFCFieldState)
  const postalCode = useRecoilValue(editablePostalCodeFieldState)
  const salaryFrequency = useRecoilValue(editableSalaryFrequencyFieldState)
  const salary = useRecoilValue(editableSalaryFieldState)

  const submit = async () => {
    try {
      await api.patch("users", {
        id: profile.id,
        "employee-number": employeeNumber,
        "bank-account-number": bankAccountNumber,
        "address-line-one": addressLineOne,
        "address-line-two": addressLineTwo,
        city,
        state,
        country,
        rfc,
        "postal-code": postalCode,
        "salary-frequency": salaryFrequency,
        salary,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return {
    submit,
  }
}

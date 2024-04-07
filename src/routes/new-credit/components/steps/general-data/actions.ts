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
  editableSalaryFieldState,
  editableIdentityDocumentFieldState,
  editableProofOfAddressFieldState,
  editableBankStatementFieldState,
  editablePayrollReceiptFieldState,
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
  const salary = useRecoilValue(editableSalaryFieldState)
  const identityDocument = useRecoilValue(editableIdentityDocumentFieldState)
  const proofOfAddress = useRecoilValue(editableProofOfAddressFieldState)
  const bankStatement = useRecoilValue(editableBankStatementFieldState)
  const payrollReceipt = useRecoilValue(editablePayrollReceiptFieldState)

  const submit = async () => {
    try {
      await api.patch("users", {
        id: profile?.id,
        employeeNumber,
        bankAccountNumber,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        country,
        rfc,
        postalCode,
        salary,
        identityDocument,
        proofOfAddress,
        bankStatement,
        payrollReceipt,
        status: "pending",
      })
    } catch (error) {
      console.error(error)
    }
  }

  return {
    submit,
  }
}

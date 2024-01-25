import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  editableEmployeeNumberFieldState,
  editableBankAccountNumberFieldState,
  editableAddressLineOneFieldState,
  editableAddressLineTwoFieldState,
  editableCityFieldState,
  editableStateFieldState,
  editablePostalCodeFieldState,
  postalCodeFieldTouchedState,
  bankAccountNumberFieldTouchedState,
  employeeNumberFieldTouchedState,
} from "./atoms";

export const useCreditScreenSubmitActions = () => {
  const employeeNumber = useRecoilValue(editableEmployeeNumberFieldState);
  const bankAccountNumber = useRecoilValue(editableBankAccountNumberFieldState);
  const addressLineOne = useRecoilValue(editableAddressLineOneFieldState);
  const addressLineTwo = useRecoilValue(editableAddressLineTwoFieldState);
  const city = useRecoilValue(editableCityFieldState);
  const state = useRecoilValue(editableStateFieldState);
  const postalCode = useRecoilValue(editablePostalCodeFieldState);
  const setPostalCodeTouched = useSetRecoilState(postalCodeFieldTouchedState);
  const setBankAccountNumberTouched = useSetRecoilState(
    bankAccountNumberFieldTouchedState
  );
  const setEmployeeNumberTouched = useSetRecoilState(
    employeeNumberFieldTouchedState
  );

  const touchFields = () => {
    setPostalCodeTouched(true);
    setBankAccountNumberTouched(true);
    setEmployeeNumberTouched(true);
  };

  const submit = () => {
    touchFields();

    console.log("submit", {
      employeeNumber,
      bankAccountNumber,
      addressLineOne,
      addressLineTwo,
      city,
      state,
      postalCode,
    });
  };

  return {
    submit,
  };
};

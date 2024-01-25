export const postalCodeFieldValidation = (postalCode: string) => {
  if (postalCode.length === 0) return "El código postal no puede estar vacío";
  if (postalCode.length !== 5) return "El código postal debe tener 5 dígitos";
  if (postalCode.match(/\D/))
    return "El código postal solo puede contener números";
  return undefined;
};

export const bankAccountNumberFieldValidation = (bankAccountNumber: string) => {
  if (bankAccountNumber.length === 0) return "CLABE no puede estar vacía";
  if (bankAccountNumber.length !== 18) return "CLABE debe tener 18 dígitos";
  return undefined;
};

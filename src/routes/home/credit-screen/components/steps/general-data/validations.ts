export const postalCodeFieldValidation = (text: string) => {
  if (text.length === 0) return "El código postal no puede estar vacío";
  if (text.match(/\D/)) return "El código postal solo puede contener números";
  if (text.length !== 5) return "El código postal debe tener 5 dígitos";
  return undefined;
};

export const bankAccountNumberFieldValidation = (text: string) => {
  if (text.length === 0) return "CLABE no puede estar vacía";
  if (text.match(/\D/)) return "La CLABE solo puede contener números";
  if (text.length !== 18) return "CLABE debe tener 18 dígitos";
  return undefined;
};

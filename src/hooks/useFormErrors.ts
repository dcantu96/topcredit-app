import { useEffect, useState } from "react";

const extractErrorMessage = (
  errorDetail: string,
  field: string
): string | null => {
  if (errorDetail.includes(field)) {
    const splitMsg = errorDetail.split(" - ");
    return splitMsg.length > 1 ? splitMsg[1] : null;
  }
  return null;
};

export const useFormErrors = () => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      setFormErrors({});
    };
  }, []);

  const handleErrors = (error: unknown, fields: string[]) => {
    if (typeof error === "object" && error !== null && "errors" in error) {
      const newErrorsObject: Record<string, string> = {};
      for (const errorItem of error.errors as { detail: string }[]) {
        for (const field of fields) {
          if (errorItem.detail.includes(field)) {
            const errorMessage = extractErrorMessage(errorItem.detail, field);
            if (errorMessage) {
              newErrorsObject[camelize(field)] = errorMessage;
            }
          }
        }
      }
      setFormErrors(newErrorsObject);
    }
  };

  const clearErrors = () => {
    setFormErrors({});
  };

  return {
    errors: formErrors,
    handleErrors,
    clearErrors,
  };
};

function camelize(str: string) {
  const arr = str.split("-");
  const capital = arr.map((item, index) =>
    index
      ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      : item.toLowerCase()
  );
  return capital.join("");
}

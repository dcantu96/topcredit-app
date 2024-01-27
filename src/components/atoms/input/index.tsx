import { useState } from "react";

interface InputBaseProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  prefix?: string;
  /**
   * When set to `true`, the input will be marked as errored.
   *
   * When set to `string`, the input will be marked as errored and the string will be displayed as error message.
   */
  error?: boolean | string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

interface InputWithTrailingDropdownProps extends InputBaseProps {
  trailingDropdownId: string;
  trailingDropdownLabel: string;
  trailingDropdownOptions: string[];
  trailingDropdownOnChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface InputWithoutTrailingDropdownProps extends InputBaseProps {
  trailingDropdownId?: never;
  trailingDropdownLabel?: never;
  trailingDropdownOptions?: never;
  trailingDropdownOnChange?: never;
}

type InputProps =
  | InputWithTrailingDropdownProps
  | InputWithoutTrailingDropdownProps;

const Input = ({
  id,
  label,
  onChange,
  value,
  required,
  error,
  maxLength,
  placeholder,
  type = "text",
  prefix,
  onBlur,
  ...trailingProps
}: InputProps) => {
  const passwordPaddingRight = type === "password" ? "pr-14" : undefined;
  const trailingDropdownPaddingRight = trailingProps.trailingDropdownId
    ? "pr-20"
    : "pr-3";

  const prefixPaddingLeft = prefix ? "pl-7" : "pl-3";

  const [passwordHidden, setPasswordHidden] = useState(true);

  const inputType =
    type === "password" ? (passwordHidden ? "password" : "text") : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={inputType}
          name={id}
          id={id}
          required={required}
          maxLength={maxLength}
          onBlur={onBlur}
          value={value || ""}
          onChange={onChange}
          className={`block w-full rounded-md border-0 py-1.5 ${
            error
              ? "ring-rose-400 focus:ring-rose-600"
              : "ring-gray-300 focus:ring-indigo-600"
          } ${prefixPaddingLeft} ${
            passwordPaddingRight || trailingDropdownPaddingRight
          } text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
          placeholder={placeholder}
        />
        {type === "password" && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              className="text-gray-500 sm:text-sm"
              onClick={() => setPasswordHidden((prev) => !prev)}
            >
              {passwordHidden ? "Mostrar" : "Esconder"}
            </button>
          </div>
        )}
        {trailingProps.trailingDropdownId && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label
              htmlFor={trailingProps.trailingDropdownId}
              className="sr-only"
            >
              {trailingProps.trailingDropdownLabel}
            </label>
            <select
              id={trailingProps.trailingDropdownId}
              name={trailingProps.trailingDropdownId}
              className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              onChange={trailingProps.trailingDropdownOnChange}
            >
              {trailingProps.trailingDropdownOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {typeof error === "string" && (
        <p className="mt-2 text-sm text-rose-600">{error}</p>
      )}
    </div>
  );
};

export default Input;

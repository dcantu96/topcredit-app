import { useState } from "react"
import Label from "../label"

interface InputBaseProps {
  id: string
  label: string
  disabled?: boolean
  type?: string
  placeholder?: string
  required?: boolean
  maxLength?: number
  fullWidth?: boolean
  min?: React.InputHTMLAttributes<HTMLInputElement>["min"]
  max?: React.InputHTMLAttributes<HTMLInputElement>["max"]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  prefix?: string
  /**
   * When set to `true`, the input will be marked as errored.
   *
   * When set to `string`, the input will be marked as errored and the string will be displayed as error message.
   */
  error?: boolean | string
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

interface InputWithTrailingDropdownProps extends InputBaseProps {
  trailingDropdownId: string
  trailingDropdownLabel: string
  trailingDropdownOptions: { label: string; value: string }[]
  trailingDropdownOnChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

interface InputWithoutTrailingDropdownProps extends InputBaseProps {
  trailingDropdownId?: never
  trailingDropdownLabel?: never
  trailingDropdownOptions?: never
  trailingDropdownOnChange?: never
}

type InputProps =
  | InputWithTrailingDropdownProps
  | InputWithoutTrailingDropdownProps

const Input = ({
  id,
  label,
  onChange,
  value,
  disabled,
  required,
  error,
  maxLength,
  placeholder,
  type = "text",
  prefix,
  onBlur,
  min,
  max,
  fullWidth,
  ...trailingProps
}: InputProps) => {
  const passwordPaddingRight = type === "password" ? "pr-14" : undefined
  const trailingDropdownPaddingRight = trailingProps.trailingDropdownId
    ? "pr-28"
    : "pr-3"

  const inputRingClasses = error
    ? "ring-rose-400 focus:ring-rose-600"
    : "ring-gray-300 focus:ring-indigo-600"

  const inputBaseClasses =
    "min-w-52 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"

  const prefixPaddingLeft = prefix ? "pl-7" : "pl-3"

  const [passwordHidden, setPasswordHidden] = useState(true)

  const inputType =
    type === "password" ? (passwordHidden ? "password" : "text") : type

  return (
    <div className={fullWidth ? "w-full" : undefined}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-2 rounded-md shadow-sm mb-8">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={inputType}
          name={id}
          id={id}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          onBlur={onBlur}
          value={value || ""}
          onChange={onChange}
          className={`${inputBaseClasses} ${inputRingClasses} ${prefixPaddingLeft} ${
            passwordPaddingRight || trailingDropdownPaddingRight
          }`}
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
              disabled={disabled}
              id={trailingProps.trailingDropdownId}
              name={trailingProps.trailingDropdownId}
              className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              onChange={trailingProps.trailingDropdownOnChange}
            >
              {trailingProps.trailingDropdownOptions.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
        {typeof error === "string" && (
          <p className="absolute -bottom-6 left-0 text-sm text-rose-600 line-clamp-1">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default Input

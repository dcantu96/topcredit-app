interface SelectProps {
  id: string
  label: string
  required?: boolean
  autoComplete?: string
  defaultValue?: string | number | readonly string[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  value: string | number | readonly string[]
  options?:
    | (string | number)[]
    | { value: string | number; label: string | number }[]
  /**
   * When set to `true`, the input will be marked as errored.
   *
   * When set to `string`, the input will be marked as errored and the string will be displayed as error message.
   */
  error?: boolean | string
}

const Select = ({
  id,
  label,
  autoComplete,
  onChange,
  value,
  required,
  error,
  options,
  defaultValue,
}: SelectProps) => {
  return (
    <div className="flex-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2 mb-7">
        <select
          id={id}
          name={id}
          required={required}
          defaultValue={defaultValue}
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
          className={`block w-full rounded-md border-0 py-1.5 ${
            error
              ? "ring-rose-400 focus:ring-rose-600"
              : "ring-gray-300 focus:ring-indigo-600"
          } text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {options?.map((option) =>
            typeof option === "object" ? (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ) : (
              <option key={option} value={option}>
                {option}
              </option>
            ),
          )}
        </select>
        {typeof error === "string" && (
          <p className="absolute -bottom-6 left-0 text-sm text-rose-600">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default Select

type OptionType = string | number

type OptionsArray = OptionType[]

interface OptionObject {
  value: OptionType
  label: OptionType
}

// Utility type to extract the `value` type from an array of options
type ExtractOptionValueType<T> = T extends (infer U)[]
  ? U extends OptionObject
    ? U["value"]
    : U
  : never

interface SelectProps<TOptions extends OptionsArray | OptionObject[]> {
  id: string
  label: string
  required?: boolean
  autoComplete?: string
  defaultValue?: ExtractOptionValueType<TOptions>
  onChange: (value?: ExtractOptionValueType<TOptions>) => void
  value?: ExtractOptionValueType<TOptions>
  options?: TOptions
  error?: boolean | string
  disabled?: boolean
}

const Select = <TOptions extends OptionsArray | OptionObject[]>({
  id,
  label,
  autoComplete,
  onChange,
  value,
  required,
  error,
  options,
  defaultValue,
  disabled,
}: SelectProps<TOptions>) => {
  return (
    <div className="flex-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm mb-8">
        <select
          id={id}
          name={id}
          required={required}
          defaultValue={defaultValue}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={({ target: { value } }) =>
            onChange(value as ExtractOptionValueType<TOptions> | undefined)
          }
          className={`block w-full rounded-md border-0 py-1.5 ${
            error
              ? "ring-rose-400 focus:ring-rose-600"
              : "ring-gray-300 focus:ring-indigo-600"
          } text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`}
        >
          <option value="" selected disabled>
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
          <p className="absolute -bottom-6 left-0 text-sm text-rose-600 line-clamp-1">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default Select

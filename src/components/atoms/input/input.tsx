interface InputBaseProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
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

export const Input = ({
  id,
  label,
  onChange,
  placeholder,
  type = "text",
  prefix,
  ...trailingProps
}: InputProps) => {
  const trailingDropdownPaddingRight = trailingProps.trailingDropdownId
    ? "pr-20"
    : "pr-3";

  const prefixPaddingLeft = prefix ? "pl-7" : "pl-3";

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
          type={type}
          name={id}
          id={id}
          onChange={onChange}
          className={`block w-full rounded-md border-0 py-1.5 ${prefixPaddingLeft} ${trailingDropdownPaddingRight} text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          placeholder={placeholder}
        />
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
    </div>
  );
};

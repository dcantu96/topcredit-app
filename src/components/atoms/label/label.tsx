interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

const Label = ({ children, ...rest }: LabelProps) => (
  <label
    className="block text-sm font-medium leading-6 text-gray-900"
    {...rest}
  >
    {children}
  </label>
)

export default Label

interface FormHeaderProps {
  children?: React.ReactNode
}

const FormHeader = ({ children }: FormHeaderProps) => {
  return (
    <div className="lg:flex lg:items-center lg:justify-between mb-4 w-full">
      {children}
    </div>
  )
}

const Title = ({
  text,
  children,
}: {
  text: string
  children?: React.ReactNode
}) => {
  return (
    <div className="min-w-0 flex-1">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {text}
      </h2>
      {children}
    </div>
  )
}

/**
 * Actions within the form header
 *
 * They are usually buttons or links separated by a gap of 8px (gap-2)
 */
const Actions = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-5 flex lg:ml-4 lg:mt-0">
      <div className="flex gap-2">{children}</div>
    </div>
  )
}

FormHeader.Title = Title
FormHeader.Actions = Actions

export default FormHeader

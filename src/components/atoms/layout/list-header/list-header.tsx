interface FormHeaderProps {
  children?: React.ReactNode
}

const ListHeader = ({ children }: FormHeaderProps) => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-gray-900/10 border-b flex items-center justify-between">
      {children}
    </header>
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
    <div className="flex gap-2">
      <h2 className="text-gray-900 leading-7 font-semibold text-base">
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
  return <div className="flex gap-2">{children}</div>
}

ListHeader.Title = Title
ListHeader.Actions = Actions

export default ListHeader

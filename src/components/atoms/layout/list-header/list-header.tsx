import { To, useNavigate } from "react-router-dom"

interface FormHeaderProps {
  children?: React.ReactNode
}

const ListHeader = ({ children }: FormHeaderProps) => {
  return (
    <header className="py-2 sm:py-4 px-4 sm:px-6 lg:px-8 border-gray-900/10 border-b flex items-center justify-between">
      {children}
    </header>
  )
}

const Title = ({
  text,
  children,
  to,
}: {
  text?: string
  children?: React.ReactNode
  to?: To
}) => {
  const navigate = useNavigate()
  return (
    <div className="flex gap-2 group group-last:text-gray-500 text-gray-900">
      {text && (
        <h2
          className={`leading-7 font-semibold text-base ${to ? "cursor-pointer hover:text-gray-700" : ""}`}
          onClick={() => (to ? navigate(to) : null)}
        >
          {text}
        </h2>
      )}
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
  return <div className="flex gap-3 items-center">{children}</div>
}

ListHeader.Title = Title
ListHeader.Actions = Actions

export default ListHeader

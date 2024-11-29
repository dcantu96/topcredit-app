const Cell = ({
  children,
  mobileOnly,
  className = "flex gap-x-6",
}: {
  children: React.ReactNode
  mobileOnly?: boolean
  className?: React.HTMLAttributes<HTMLDivElement>["className"]
}) => {
  return (
    <td
      className={`odd:px-6 group first:relative first:!pl-0 last:!pr-0 py-5 last:text-right ${mobileOnly ? "hidden sm:table-cell" : ""}`}
    >
      <div className={`${className} group-last:justify-end`}>{children}</div>
      <div className="group-first:block absolute hidden bottom-0 right-full h-px w-screen bg-gray-100"></div>
      <div className="group-first:block absolute hidden bottom-0 left-0 h-px w-screen bg-gray-100"></div>
    </td>
  )
}

const Data = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-4 sm:px-0">{children}</div>
}

const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="gap-x-3 items-start flex group-last:justify-end">
      {children}
    </div>
  )
}

const Text = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="font-medium text-sm leading-6 text-gray-900">
      {children}
    </div>
  )
}

const Subtitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-gray-500 text-xs leading-5 mt-1">{children}</div>
}

Data.Title = Title
Data.Text = Text
Data.Subtitle = Subtitle
Cell.Data = Data

export default Cell

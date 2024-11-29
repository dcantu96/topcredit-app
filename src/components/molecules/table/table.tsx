import ScreenReader from "./screen-reader"

const Table = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-gray-100 border-t overflow-hidden mt-6">
      <div className="lg:px-8 sm:px-6 px:4 max-w-7xl mx-auto">
        <div className="lg:max-w-none lg:mx-0 max-w-2xl mx-auto">
          <table className="text-left w-full indent-0 border-inherit border-collapse">
            {children}
          </table>
        </div>
      </div>
    </div>
  )
}

const Body = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>
}

const Divider = ({
  children,
  span,
}: {
  children: React.ReactNode
  span: number
}) => {
  return (
    <tr className="text-sm leading-6 text-gray-900">
      <th
        scope="colgroup"
        colSpan={span}
        className="relative isolate py-2 font-semibold"
      >
        <span className="px-4 sm:px-0">{children}</span>
        <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-50 bg-gray-50"></div>
        <div className="absolute inset-y-0 bq -z-10 w-screen border-b border-gray-50 bg-gray-50"></div>
      </th>
    </tr>
  )
}

const Row = ({ children }: { children: React.ReactNode }) => {
  return <tr>{children}</tr>
}

Table.ScreenReader = ScreenReader
Table.Body = Body
Table.Divider = Divider
Table.Row = Row

export default Table

interface ITable {
  children?: React.ReactNode
}

const List = ({ children }: ITable) => {
  return (
    <div className="relative rounded-xl overflow-auto bg-slate-100 shadow-sm">
      <div className="shadow-sm my-8">
        <table className="border-collapse table-auto w-full text-sm">
          {children}
        </table>
      </div>
    </div>
  )
}

interface ITableHeader {
  columns?: string[]
}

const Header = ({ columns }: ITableHeader) => {
  const rowPadding = (index: number) =>
    columns?.length === index + 1 ? "pr-8" : index === 0 ? "pl-8" : ""
  return (
    <thead>
      <tr>
        {columns?.map((column, index) => (
          <th
            key={column}
            className={`border-b font-medium p-4 pt-0 pb-3 text-slate-400 text-left ${rowPadding(
              index,
            )}`}
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  )
}

const Body = ({ children }: ITable) => {
  return <tbody className="bg-white">{children}</tbody>
}

const Row = ({ children }: ITable) => {
  return <tr>{children}</tr>
}

const Cell = ({ children }: ITable) => {
  return (
    <td className="border-b border-slate-100 p-4 first:pl-8 last:pr-8 text-slate-500">
      <div className="inline-flex items-center">{children}</div>
    </td>
  )
}

List.Header = Header
List.Body = Body
List.Row = Row
List.Cell = Cell

export default List

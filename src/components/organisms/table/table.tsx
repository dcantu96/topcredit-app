interface ITable {
  children?: React.ReactNode
}

const Table = ({ children }: ITable) => {
  return (
    <div className="relative rounded-xl overflow-auto bg-slate-100 shadow-sm">
      <div className="shadow-sm overflow-hidden my-8">
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

Table.Header = Header

export { Table }

const ScreenReader = ({ children }: { children: React.ReactNode }) => {
  return (
    <thead className="sr-only">
      <tr>{children}</tr>
    </thead>
  )
}

const Header = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: React.HTMLAttributes<HTMLTableCellElement>["className"]
}) => {
  return <th className={className}>{children}</th>
}

ScreenReader.Header = Header

export default ScreenReader

interface ListProps {
  children: React.ReactNode
}

const List = ({ children }: ListProps) => {
  return (
    <ul className="list-none m-0 p-0" role="list">
      {children}
    </ul>
  )
}

const Item = ({ children }: ListProps) => {
  return (
    <li className="py-4 px-4 sm:px-6 lg:px-8 items-center flex relative border-b border-gray-900/10 flex-wrap">
      {children}
    </li>
  )
}

List.Item = Item

export default List

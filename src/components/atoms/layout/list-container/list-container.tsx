interface ListContainerProps {
  children: React.ReactNode
}

const ListContainer = ({ children }: ListContainerProps) => {
  return <div className="flex-1 flex-shrink-0">{children}</div>
}

export default ListContainer

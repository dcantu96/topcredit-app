interface ListContainerProps {
  children: React.ReactNode
}

const ListContainer = ({ children }: ListContainerProps) => {
  return (
    <div className="flex-1 flex-shrink-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
      {children}
    </div>
  )
}

export default ListContainer

interface IContent {
  children?: React.ReactNode
}

export const Content = ({ children }: IContent) => {
  return (
    <div className="lg:pl-[17rem]">
      <div className="p-4">{children}</div>
    </div>
  )
}

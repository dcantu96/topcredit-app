interface IContent {
  children?: React.ReactNode
}

export const Content = ({ children }: IContent) => {
  return <>{children}</>
}

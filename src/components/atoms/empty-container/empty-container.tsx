/**
 * This component is useful to place content for the screens that use the `List` component
 */
const EmptyContainer = ({
  children,
}: {
  children?: React.ReactNode
}): JSX.Element => {
  return (
    <div className="w-full min-h-80 flex items-center justify-center flex-col px-4 py-8">
      {children}
    </div>
  )
}

export default EmptyContainer

interface DropdownListItemProps {
  text: string
  onClick?: () => void
}

const DropdownListItem = ({ text, onClick }: DropdownListItemProps) => {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
    >
      {text}
    </button>
  )
}

export default DropdownListItem

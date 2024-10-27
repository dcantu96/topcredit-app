import { RowCardProps } from "./row-card.types"

const RowCard = ({ children }: RowCardProps) => (
  <div className="flex">
    <div className="bg-white p-2 px-4 flex flex-col justify-between leading-normal shadow-md rounded ring-1 ring-slate-100">
      <div>{children}</div>
    </div>
  </div>
)

const Outline = ({ children }: RowCardProps) => (
  <p className="text-sm text-gray-600 flex items-center">{children}</p>
)

const Text = ({ children }: RowCardProps) => (
  <div className="text-gray-900 font-bold text-lg mb-2">{children}</div>
)

RowCard.Outline = Outline
RowCard.Text = Text

export default RowCard

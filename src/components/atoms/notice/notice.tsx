import { ColorOption } from "../status-indicator/status-indicator.types"
import type { NoticeProps } from "./notice.types"

const Notice = ({
  title,
  description,
  tag,
  color = "primary",
}: NoticeProps): JSX.Element => {
  const ringClasses: Record<ColorOption, string> = {
    error: "ring-red-500",
    warning: "ring-yellow-500",
    success: "ring-green-500",
    primary: "ring-indigo-500",
    info: "ring-slate-700",
    secondary: "ring-slate-500",
  }
  return (
    <div
      className={`pointer-events-auto rounded-lg bg-white p-4 text-[0.8125rem] leading-5 shadow-xl shadow-black/5 ring-2 ${ringClasses[color]}`}
    >
      <div className="flex justify-between">
        <div className="font-medium text-slate-900">{title}</div>
      </div>
      <div className="mt-1 text-slate-700">{description}</div>
      {tag && <div className="mt-6 font-medium text-slate-900">{tag}</div>}
    </div>
  )
}

export default Notice

import { Suspense } from "react"
import { NavLink } from "react-router-dom"

import NotificationList from "./components/notifications-list"
import type { ActivityContainerProps } from "./activity-container.types"

const ActivityContainer = ({
  notificationType,
  to,
}: ActivityContainerProps) => {
  return (
    <aside className="bg-slate-50 lg:border-gray-900/10 lg:border-l w-full lg:w-96 lg:top-16 lg:h-full h-fit">
      <header className="py-2 sm:py-4 px-4 sm:px-6 lg:px-8 min-h-[70px] border-gray-900/10 border-b flex items-center">
        <div className="flex items-baseline justify-between flex-1">
          <h2 className="text-gray-900 leading-7 font-semibold text-base">
            Actividad
          </h2>
          <NavLink to={to}>Ver todo</NavLink>
        </div>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationList type={notificationType} />
      </Suspense>
    </aside>
  )
}

export default ActivityContainer

import { useRecoilValue } from "recoil"
import StatusIndicator from "components/atoms/status-indicator"
import { notificationsSelector } from "../../atoms"
import type { NotificationType } from "../../../../../schema.types"
import dayjs from "dayjs"
import "dayjs/locale/es"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const NotificationList = ({ types }: { types: NotificationType[] }) => {
  const notifications = useRecoilValue(notificationsSelector(types))

  return (
    <>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="py-4 px-4 sm:px-6 lg:px-8 border-gray-900/10 border-b"
        >
          <div className="flex items-center gap-x-3">
            <StatusIndicator color="info" className="self-start mt-1" />
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
                <a className="flex text-inherit decoration-inherit gap-x-2">
                  <span className="line-clamp-2">{notification.message}</span>
                </a>
              </div>
              <div className="mt-2 flex items-center gap-x-[0.625rem] text-xs leading-5 text-gray-400">
                <p className="whitespace-nowrap">
                  {dayjs(notification.createdAt).locale("es").fromNow()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default NotificationList

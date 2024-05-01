import { To } from "react-router-dom"

export type NotificationType = "UserStatusChangeNotifier::Notification"

export interface ActivityContainerProps {
  notificationType: NotificationType
  to: To
}

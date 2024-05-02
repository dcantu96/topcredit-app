import type { To } from "react-router-dom"
import type { NotificationType } from "../../../schema.types"

export interface ActivityContainerProps {
  notificationTypes: NotificationType[]
  to: To
}

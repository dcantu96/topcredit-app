import type { To } from "react-router-dom"
import type { NotificationType } from "../../../schema.types"

export interface ActivityContainerProps {
  notificationType: NotificationType
  to: To
}

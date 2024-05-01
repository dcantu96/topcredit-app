import { selectorFamily } from "recoil"
import { apiSelector } from "components/providers/api/atoms"
import { myProfileState } from "components/providers/auth/atoms"
import type { Notification } from "src/schema.types"
import type { NotificationType } from "./activity-container.types"

export const notificationsSelector = selectorFamily<
  Pick<Notification, "id" | "message" | "createdAt">[],
  NotificationType
>({
  key: "notificationsSelector",
  get:
    (type) =>
    async ({ get }) => {
      const user = get(myProfileState)
      const api = get(apiSelector)
      const { data }: { data: Notification[] } = await api.get(
        `users/${user?.id}/notifications`,
        {
          params: {
            filter: {
              type,
            },
            fields: {
              notifications: "id,message,createdAt",
            },
            page: {
              limit: 10,
              number: 0,
            },
            sort: "-createdAt",
          },
        },
      )

      return data
    },
})

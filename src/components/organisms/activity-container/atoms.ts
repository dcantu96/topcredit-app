import { selectorFamily } from "recoil"
import { apiSelector } from "components/providers/api/atoms"
import { myProfileState } from "components/providers/auth/atoms"
import type { Notification, NotificationType } from "../../../schema.types"

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
            ...(type
              ? {
                  filter: {
                    type: `${type}Notifier::Notification`,
                  },
                }
              : {}),
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

      console.log(data)

      return data
    },
})

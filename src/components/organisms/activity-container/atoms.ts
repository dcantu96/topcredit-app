import { selectorFamily } from "recoil"
import { apiSelector } from "components/providers/api/atoms"
import { myProfileState } from "components/providers/auth/atoms"
import type {
  Notification,
  NotificationType,
  Event,
} from "../../../schema.types"

export const notificationsSelector = selectorFamily<
  Pick<Notification, "id" | "message" | "createdAt">[],
  NotificationType[]
>({
  key: "notificationsSelector",
  get:
    (types) =>
    async ({ get }) => {
      const user = get(myProfileState)
      const api = get(apiSelector)
      const { data }: { data: Notification[] } = await api.get(
        `users/${user?.id}/notifications`,
        {
          params: {
            ...(types
              ? {
                  filter: {
                    type: types
                      .map((type) => `${type}Notifier::Notification`)
                      .join(","),
                  },
                }
              : {}),
            fields: {
              notifications: "id,message,createdAt",
            },
            // include: "event",
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

export const eventsSelector = selectorFamily<
  Pick<Event, "id" | "params" | "record" | "createdAt">[],
  NotificationType[]
>({
  key: "eventsSelector",
  get:
    (types) =>
    async ({ get }) => {
      const api = get(apiSelector)
      const { data }: { data: Event[] } = await api.get(`events`, {
        params: {
          ...(types
            ? {
                filter: {
                  type: types.map((type) => `${type}Notifier`).join(","),
                },
              }
            : {}),
          fields: {
            events: "id,createdAt,record",
          },
          include: "record",
          page: {
            limit: 10,
            number: 0,
          },
          sort: "-createdAt",
        },
      })

      console.log({ data })

      return data
    },
})

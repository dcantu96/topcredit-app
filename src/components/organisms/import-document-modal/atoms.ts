import { apiSelector } from "components/providers/api/atoms"
import { selector } from "recoil"

export const dispersedCreditsImportSelector = selector({
  key: "dispersedCreditsImportSelector",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const credits = await api.get("credits", {
      params: {
        include: "borrower",
        fields: {
          users: "id,employeeNumber",
          credits: "id,borrower",
        },
        filter: {
          status: "dispersed",
          installationStatus: "installed",
        },
      },
    })
    return credits?.data
  },
})

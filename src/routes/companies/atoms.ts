import { apiSelector } from "components/providers/api/atoms"
import { atom, selector } from "recoil"
import { Term, Company } from "src/schema.types"

export type NewTerm = Omit<Term, "id" | "createdAt" | "updatedAt">

export interface AssignTermForCompany {
  termId: string
  companyId: string
}

export interface EditTerm extends NewTerm {
  id: string
}
export interface NewCompany
  extends Omit<Company, "id" | "terms" | "createdAt" | "updatedAt"> {
  terms?: NewTerm[]
}

export interface EditCompany extends NewCompany {
  id: string
}

export const termsSelectorQuery = selector<Map<string, Term>>({
  key: "termsSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get<Term[]>("terms")
    const termsMap = new Map<string, Term>()
    for (const term of data) {
      termsMap.set(term.id, term)
    }
    return termsMap
  },
})

export const termsState = atom<Map<string, Term>>({
  key: "termsState",
  default: termsSelectorQuery,
})

import { apiSelector } from "components/providers/api/atoms"
import { atom, selector } from "recoil"

export interface NewTerm {
  name?: string
  durationType: string
  duration: number
}

export interface NewTermForCompany extends NewTerm {
  companyId: string
}

export interface AssignTermForCompany {
  termId: string
  companyId: string
}

export interface EditTerm extends NewTerm {
  id: number
}
export interface NewCompany {
  name: string
  domain: string
  rate?: number
  terms?: NewTerm[]
}

export interface EditCompany extends NewCompany {
  id: string
}

interface TermsQueryResponse {
  id: string
  durationType: string
  duration: number
  name: string
  createdAt: string
  updatedAt: string
}

export const termsSelectorQuery = selector<Map<string, TermsQueryResponse>>({
  key: "termsSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get<TermsQueryResponse[]>("terms")
    const termsMap = new Map<string, TermsQueryResponse>()
    for (const term of data) {
      termsMap.set(term.id, term)
    }
    return termsMap
  },
})

export const termsState = atom<Map<string, TermsQueryResponse>>({
  key: "termsState",
  default: termsSelectorQuery,
})

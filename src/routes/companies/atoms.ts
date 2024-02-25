import { apiSelector } from "components/providers/api/atoms"
import { selector } from "recoil"

export interface NewTerm {
  name?: string
  durationType: string
  duration: number
}

export interface NewTermForCompany extends NewTerm {
  companyId: number
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
  id: number
  terms: EditTerm[]
}

interface TermsQueryResponse {
  id: number
  type: string
  duration: number
  name: string
}

export const termsSelectorQuery = selector<
  ReadonlyMap<number, TermsQueryResponse>
>({
  key: "termsSelectorQuery",
  get: async ({ get }) => {
    const api = get(apiSelector)
    const { data } = await api.get<TermsQueryResponse[]>("terms")
    const termsMap = new Map<number, TermsQueryResponse>()
    for (const term of data) {
      termsMap.set(term.id, term)
    }
    return termsMap
  },
})

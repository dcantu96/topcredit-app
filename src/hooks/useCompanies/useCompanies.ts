import { useRecoilValue } from "recoil"
import { companiesSelectorQuery } from "./atoms"

const useCompanies = () => {
  return useRecoilValue(companiesSelectorQuery)
}

export default useCompanies

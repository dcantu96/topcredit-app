import { useMemo } from "react"
import { calculateAmortization } from "./utils"
import useCompanies from "hooks/useCompanies"
import { useRecoilValue } from "recoil"
import { creditSelector } from "../../routes/pending-authorizations/atoms"

const useCreditAmortization = (creditId: string) => {
  const credit = useRecoilValue(creditSelector(creditId))
  const companiesMap = useCompanies()

  const userDomain = credit?.borrower.email.split("@")[1]
  const company = userDomain ? companiesMap.get(userDomain) : undefined
  const rate = company?.rate
  const duration = credit?.term.duration
  const durationType = credit?.term.durationType
  const loan = credit?.loan

  const amortization = useMemo(() => {
    if (!loan || !duration || !durationType || !rate) return undefined

    return calculateAmortization({
      loanAmount: loan,
      duration,
      durationType,
      rate,
    })
  }, [loan, duration, durationType, rate])

  return amortization
}

export default useCreditAmortization

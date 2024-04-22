import List from "components/atoms/list"
import { type CompanyCredits } from "./atoms"
import { useNavigate } from "react-router-dom"
import { ChevronRightIcon } from "@heroicons/react/16/solid"

const ListItem = ({ company }: { company: CompanyCredits }) => {
  const navigate = useNavigate()

  // const totalToCollectSinceLastCollectionDate = useMemo(() => {
  //   return dispersedCredits.reduce((acc, credit) => {

  //     const amortization = calculateAmortization({
  //       loanAmount: credit.loan,
  //       term: credit.termOffering?.term,
  //       rate: credit?.rate,
  //       totalPayments
  //     })
  //     return acc + amortization
  //   }, 0)
  // }

  // here we will show the company name and domain
  // secondly, we will show what is supposed to be collected by the next collection date, this varies depending on the company salary frequency
  // thirdly, we will show the total collected amount since last collection date
  // fourthly, we will show the missing amount to be collected since last collection date
  // lastly, button link to navigate to the company credits page to see the detailed credits and their payments status

  return (
    <List.Item>
      <div className="flex-1 min-w-56">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                {company.name}
              </span>
              <span className="text-gray-400">/</span>
              <span className="whitespace-nowrap">{company.domain}</span>
            </a>
          </h2>
        </div>
      </div>
      <div className="min-w-32">
        <div className="flex items-center gap-x-3">
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0">
            <a className="flex text-inherit decoration-inherit gap-x-2">
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                Total a cobrar
              </span>
            </a>
          </h2>
        </div>
        <span className="whitespace-nowrap"></span>
      </div>
      <button
        onClick={() => navigate("/dashboard/payments/" + company.id)}
        className="btn btn-small btn-transparent group text-gray-900 leading-7 text-sm font-medium"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
      </button>
    </List.Item>
  )
}

export default ListItem

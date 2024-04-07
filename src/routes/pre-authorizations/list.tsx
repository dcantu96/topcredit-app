import { useRecoilValue } from "recoil"
import { useMemo, useState } from "react"

import NavLink from "components/atoms/nav-link"
import ListSortOrderHandler from "components/organisms/list-sort-order-handler"
import SmallDot from "components/atoms/small-dot"
import Button from "components/atoms/button"
import ListContainer from "components/atoms/layout/list-container"
import ListHeader from "components/atoms/layout/list-header"
import List from "components/atoms/list"
import Input from "components/atoms/input"
import useUserActions from "hooks/useUserActions"
import useCreditActions from "hooks/useCreditActions"

import {
  PreAuthorizationUsersResponse,
  preAuthorizationUsersState,
} from "./atoms"
import { DURATION_TYPES, MXNFormat } from "../../constants"
import { usePreAuthorizationActions } from "./actions"
import { calculateAmortization } from "hooks/useCreditAmortization/utils"
import { companiesDataSelector } from "../companies/loader"

const Screen = () => {
  const preAuthorizationUsers = useRecoilValue(preAuthorizationUsersState)
  return (
    <>
      {/* pending request */}
      <ListContainer>
        <ListHeader>
          <ListHeader.Title text="Solicitudes Pre-Aprobadas" />
          <ListHeader.Actions>
            <ListSortOrderHandler listName="pre-authorizations" />
          </ListHeader.Actions>
        </ListHeader>
        <List>
          {preAuthorizationUsers.map((user) => (
            <PreAuthorizationUserItem key={user.id} user={user} />
          ))}
        </List>
      </ListContainer>
      {/* activity */}
      <aside className="bg-slate-50 lg:border-gray-900/10 lg:border-l w-full lg:w-96 lg:top-16 lg:h-full h-fit">
        <header className="py-4 px-4 sm:px-6 lg:px-8 min-h-[70px] border-gray-900/10 border-b flex items-center">
          <div className="flex items-baseline justify-between flex-1">
            <h2 className="text-gray-900 leading-7 font-semibold text-base">
              Actividad
            </h2>
            <NavLink to="/pre-authorizations">Ver todo</NavLink>
          </div>
        </header>
      </aside>
    </>
  )
}

interface PreAuthorizationUserItemProps {
  user: PreAuthorizationUsersResponse
}

const PreAuthorizationUserItem = ({ user }: PreAuthorizationUserItemProps) => {
  const { updateUserStatus } = useUserActions(user.id)
  const { removeUser } = usePreAuthorizationActions()
  const { createCredit } = useCreditActions()
  const companies = useRecoilValue(
    companiesDataSelector({
      filter: {
        domain: user.email?.split("@")?.[1],
      },
      include: "terms",
    }),
  )
  const [loanAmount, setLoanAmount] = useState(0)
  const [loanTermId, setLoanTermId] = useState("")

  const company = companies?.[0]
  const borrowerMaxCapacity =
    user.salary && company?.borrowingCapacity
      ? user.salary * company.borrowingCapacity
      : undefined

  const termOptions = useMemo(
    () =>
      company?.terms?.map((term) => ({
        label: `${term.duration} ${DURATION_TYPES.get(term.durationType)}`,
        value: term.id,
      })),
    [company],
  )
  const term = company?.terms.find((term) => term.id === loanTermId)

  const amortization = useMemo(() => {
    if (!term) return undefined

    if (!loanAmount || !company?.rate) return undefined

    return calculateAmortization({
      duration: term.duration,
      durationType: term.durationType,
      loanAmount,
      rate: company?.rate,
    })
  }, [term, loanAmount, company?.rate])

  const loanAmountErrorMsg = useMemo(() => {
    if (
      borrowerMaxCapacity &&
      amortization &&
      borrowerMaxCapacity < amortization
    ) {
      return `El monto es mayor a ${MXNFormat.format(borrowerMaxCapacity)}`
    }
    return undefined
  }, [borrowerMaxCapacity, amortization])

  const formattedBorrowingCapacity = company?.borrowingCapacity
    ? `${company.borrowingCapacity * 100} %`
    : undefined

  const handlePreAuthorize = async () => {
    await updateUserStatus("pre-authorized")
    await createCredit({
      userId: user.id,
      loan: loanAmount,
      termId: loanTermId,
    })
    removeUser(user.id)
  }

  const handleDeny = async () => {
    await updateUserStatus("denied")
    removeUser(user.id)
  }

  return (
    <List.Item>
      <div className="min-w-80">
        <div className="flex items-center gap-x-3">
          <div className="bg-gray-100 p-1 rounded-full flex-none shadow-sm">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          <h2 className="text-gray-900 leading-6 font-semibold text-sm min-w-0 flex text-inherit decoration-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-gray-400">/</span>
            <span className="whitespace-nowrap">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-x-3 mt-1">
          <p className="text-gray-500 leading-6 font-medium text-sm min-w-0 flex text-inherit gap-x-2">
            <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {user.salary ? MXNFormat.format(user.salary) : 0}
            </span>
            <span className="text-gray-400">/</span>
            <span className="whitespace-nowrap">
              {companies?.[0].employeeSalaryFrequency === "biweekly"
                ? "Quincenales"
                : "Mensuales"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-x-3 text-xs leading-5 text-gray-500">
          <p className="whitespace-nowrap">{user.employeeNumber}</p>
          <SmallDot />
          <p className="whitespace-nowrap">{user.email.split("@")[1]}</p>
          <SmallDot />
          <p className="whitespace-nowrap">
            Max End {formattedBorrowingCapacity}
          </p>
        </div>
      </div>
      <div className="flex-1 min-w-96 flex justify-between gap-4">
        <div>
          <Input
            id={`loan-amount-${user.id}`}
            value={loanAmount.toString()}
            onChange={({ target }) => setLoanAmount(Number(target.value))}
            type="number"
            prefix="$"
            error={loanAmountErrorMsg}
            label={`Préstamo ${
              amortization ? `(${MXNFormat.format(amortization)} Mensual)` : ""
            }`}
            placeholder="10,000"
            trailingDropdownId="loan-amount-frequency"
            trailingDropdownLabel="Frecuencia de pago"
            trailingDropdownOptions={termOptions || []}
            trailingDropdownOnChange={({ target }) => {
              setLoanTermId(target.value)
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            status="primary"
            onClick={handlePreAuthorize}
            disabled={!!loanAmountErrorMsg || !loanAmount || !loanTermId}
          >
            Pre-Autorizar
          </Button>
          <Button onClick={handleDeny} status="secondary">
            Rechazar
          </Button>
        </div>
      </div>
    </List.Item>
  )
}

export default Screen

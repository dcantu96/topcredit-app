import { useState, useMemo } from "react"
import { useRecoilValue } from "recoil"

import useCreditActions from "hooks/useCreditActions"
import useUserActions from "hooks/useUserActions"
import {
  calculateAmortization,
  calculateMaxDebtCapacity,
  calculateMaxLoanAmount,
} from "../../utils"
import { companiesDataSelector } from "../companies/loader"
import { DURATION_TYPES, MXNFormat } from "../../constants"

import { isUserAdminSelector } from "components/providers/auth/atoms"
import Button from "components/atoms/button"
import List from "components/atoms/list"
import SmallDot from "components/atoms/small-dot"
import Input from "components/atoms/input"
import Tooltip from "components/atoms/tooltip"
import StatusIndicator from "components/atoms/status-indicator"

import { usePreAuthorizationActions } from "./actions"

import type { PreAuthorizationUsersResponse } from "./atoms"

interface PreAuthorizationListItemProps {
  user: PreAuthorizationUsersResponse
}

const PreAuthorizationListItem = ({ user }: PreAuthorizationListItemProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const isAdmin = useRecoilValue(isUserAdminSelector)
  const { updateUserStatus } = useUserActions(user.id)
  const { removeUser } = usePreAuthorizationActions()
  const { createCredit } = useCreditActions()
  const companies = useRecoilValue(
    companiesDataSelector({
      filter: {
        domain: user.email?.split("@")?.[1],
      },
      include: "termOfferings.term",
    }),
  )
  const [loanAmount, setLoanAmount] = useState(0)
  const [termOfferingId, setTermOfferingId] = useState("")

  const company = companies?.[0]
  const termOfferings = company?.termOfferings

  const termOptions = useMemo(
    () =>
      termOfferings?.map((termOffering) => ({
        label: `${termOffering.term.duration} ${DURATION_TYPES.get(termOffering.term.durationType)}`,
        value: termOffering.id,
      })),
    [termOfferings],
  )

  const termOffering = company?.termOfferings?.find(
    (termOffering) => termOffering.id === termOfferingId,
  )
  const term = termOffering?.term
  const termDuration = term?.duration

  const amortization = useMemo(() => {
    if (!loanAmount || !company?.rate) return undefined
    if (!termDuration) return undefined
    return calculateAmortization({
      totalPayments: termDuration,
      loanAmount,
      rate: company?.rate,
    })
  }, [loanAmount, company?.rate, termDuration])

  const maxDebtCapacity = useMemo(() => {
    return calculateMaxDebtCapacity({
      salary: user.salary!,
      companyMaxRateCapacity: company.borrowingCapacity!,
    })
  }, [user.salary, company.borrowingCapacity])

  const maxLoanAmount = useMemo(() => {
    if (termDuration && company.rate) {
      return calculateMaxLoanAmount({
        maxDebtCapacity,
        payments: termDuration,
        rate: company.rate,
      })
    }
    return undefined
  }, [termDuration, company.rate, maxDebtCapacity])

  const loanAmountErrorMsg = useMemo(() => {
    if (
      maxDebtCapacity &&
      amortization &&
      maxLoanAmount &&
      maxDebtCapacity < amortization
    ) {
      return `Monto mayor que ${MXNFormat.format(maxLoanAmount)}`
    }
    return undefined
  }, [amortization, maxDebtCapacity, maxLoanAmount])

  const formattedBorrowingCapacity = company?.borrowingCapacity
    ? `${company.borrowingCapacity * 100} %`
    : undefined

  const handlePreAuthorize = async () => {
    setIsLoading(true)
    try {
      await updateUserStatus("pre-authorized")
      await createCredit({
        userId: user.id,
        loan: loanAmount,
        termOfferingId,
      })
      removeUser(user.id)
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }

  const handleDeny = async () => {
    await updateUserStatus("denied")
    removeUser(user.id)
  }

  const frequency =
    companies?.[0].employeeSalaryFrequency === "biweekly"
      ? "Quincenales"
      : "Mensuales"

  return (
    <List.Item>
      <div className="min-w-80">
        <div className="flex items-center gap-x-3">
          <StatusIndicator color="info" />
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
            <span className="whitespace-nowrap">{frequency}</span>
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
              amortization
                ? `(${MXNFormat.format(amortization)} ${frequency})`
                : ""
            }`}
            placeholder="10,000"
            trailingDropdownId="loan-amount-frequency"
            trailingDropdownLabel="Frecuencia de pago"
            trailingDropdownOptions={termOptions || []}
            trailingDropdownOnChange={({ target }) => {
              setTermOfferingId(target.value)
            }}
          />
          {maxLoanAmount ? (
            <div>Máximo End. {MXNFormat.format(maxLoanAmount)} MXN</div>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          <Tooltip
            content="Administradores pueden autorizar"
            cond={!!loanAmountErrorMsg && isAdmin}
          >
            <Button
              status="primary"
              className={
                loanAmountErrorMsg && isAdmin ? "bg-red-500" : undefined
              }
              onClick={handlePreAuthorize}
              disabled={
                ((!!loanAmountErrorMsg || !loanAmount || !termOfferingId) &&
                  !isAdmin) ||
                (isAdmin && (!loanAmount || !termOfferingId)) ||
                isLoading
              }
            >
              Pre-Autorizar
            </Button>
          </Tooltip>
          <Button onClick={handleDeny} status="secondary">
            Rechazar
          </Button>
        </div>
      </div>
    </List.Item>
  )
}

export default PreAuthorizationListItem

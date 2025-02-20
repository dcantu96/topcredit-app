import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"

import { companyInstalledCreditsQuery } from "./loader"
import { companySelectorQuery } from "../loader"

import { MXNFormat, FREQUENCY_OPTIONS } from "../../../constants"

import ButtonLink from "components/atoms/button-link"
import DispersedByFrequencyChart from "./dispersedByFrequencyChart"
import DeductedByFreqChart from "./deductedByFrequencyChart"

const CompanyOverview = () => {
  const { id } = useParams()
  if (!id) throw new Error("Missing company id param")
  const installedCredits = useRecoilValue(companyInstalledCreditsQuery(id))
  const company = useRecoilValue(companySelectorQuery(id))

  const totalCollected = useMemo(
    () =>
      installedCredits.reduce(
        (acc, { payments }) =>
          acc + payments.reduce((acc, { amount }) => acc + amount, 0),
        0,
      ),
    [installedCredits],
  )

  const totalLoaned = useMemo(
    () => installedCredits.reduce((acc, { loan }) => acc + (loan ?? 0), 0),
    [installedCredits],
  )

  const totalCreditAmount = useMemo(
    () =>
      installedCredits.reduce(
        (acc, { creditAmount }) => acc + (Number(creditAmount) ?? 0),
        0,
      ),
    [installedCredits],
  )

  const outstandingBalance = useMemo(
    () => totalCreditAmount - totalCollected,
    [totalCreditAmount, totalCollected],
  )

  return (
    <div className="flex w-full flex-col">
      <header className="pt-6 pb-4 sm:pb-6">
        <div className="px-4 gap-6 items-center flex-wrap max-w-7xl flex mx-auto md:flex-nowrap md:px-6 lg:px-8">
          <h1 className="text-gray-900 text-base leading-7 font-semibold whitespace-nowrap mr-auto">
            {company.name} - Balance General
          </h1>
          <div className="flex items-center gap-4">
            <ButtonLink to=".." size="sm">
              Regresar
            </ButtonLink>
            <ButtonLink to="credits" size="sm">
              Créditos
            </ButtonLink>
            {
              FREQUENCY_OPTIONS.find(
                ({ value }) => value === company.employeeSalaryFrequency,
              )?.label
            }
          </div>
        </div>
      </header>

      <div className="border-b border-gray-900/10 lg:border-t border-t-gray-900/5">
        <dl className="grid mx-auto max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Total Prestado
            </dt>
            <dd className="text-xs font-medium text-gray-500">+4.75%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              {MXNFormat.format(totalLoaned)}
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 sm:border-l border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Total Recolectado
            </dt>
            <dd className="text-xs font-medium text-gray-500">+54.02%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              {MXNFormat.format(totalCollected)}
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 border-t lg:border-l lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Pendiente
            </dt>
            <dd className="text-xs font-medium text-gray-500">-1.39%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-gray-900">
              {MXNFormat.format(outstandingBalance)}
            </dd>
          </div>
          <div className="sm:px-6 py-10 px-4 border-gray-900/5 sm:border-l border-t lg:border-t-0 xl:px-8 gap-y-2 gap-x-4 justify-between items-baseline flex-wrap flex">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Cartera Vencida
            </dt>
            <dd className="text-xs font-medium text-gray-500">--.--%</dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 -tracking-tight text-red-600">
              ---
            </dd>
          </div>
        </dl>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mt-6">
        <DispersedByFrequencyChart />
        <DeductedByFreqChart />
      </div>
    </div>
  )
}

export default CompanyOverview

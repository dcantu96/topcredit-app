import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "components/ui/chart"
import { companyInstalledCreditsQuery } from "./loader"
import { useRecoilValue } from "recoil"
import { useParams } from "react-router"
import { useMemo } from "react"
import { companySelectorQuery } from "../loader"
import dayjs from "dayjs"
import { amortizedTable } from "../../../routes/company-installations/utils"

const chartConfig = {
  amount: {
    label: "Dispersiones",
    color: "hsl(var(--chart-1))",
  },
  expected: {
    label: "Expected",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function DeductedByFreqChart() {
  const { id } = useParams()
  if (!id) throw new Error("Missing company id param")
  const dispersedCredits = useRecoilValue(companyInstalledCreditsQuery(id))
  const company = useRecoilValue(companySelectorQuery(id))

  const dispersedAmountByFreq = useMemo(() => {
    const deductionsByPeriod = dispersedCredits.reduce(
      (
        acc,
        { payments, amortization, termOffering, installationDate, dispersedAt },
      ) => {
        const amortized = amortizedTable(
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          termOffering?.term.duration!,
          company.employeeSalaryFrequency,
          Number(amortization),
          installationDate ?? dispersedAt!,
        )

        // Merge payments with amortized data
        amortized.forEach(({ expected, dueDate }) => {
          const date = new Date(dueDate) // Use due date for period calculation
          let period
          let label

          if (company.employeeSalaryFrequency === "monthly") {
            period = date.toISOString().slice(0, 7) // YYYY-MM
            label = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            })
          } else {
            const year = date.getFullYear()
            const month = date.toLocaleString("default", { month: "2-digit" }) // MM
            const day = date.toLocaleString("default", { day: "2-digit" }) // DD
            const weekNumber = date.getDate() > 15 ? 2 : 1
            period = `${year}-${month}-${day}` // YYYY-MM-DD
            label = `${month}-Q${weekNumber}`
          }

          if (!acc[period]) {
            acc[period] = {
              expected: 0, // Initialize expected to 0
              amount: 0,
              label: label,
            }
          }
          acc[period].expected += expected // Accumulate expected amount
        })

        payments.forEach(({ amount, createdAt }) => {
          const date = new Date(createdAt)
          let period
          let label

          if (company.employeeSalaryFrequency === "monthly") {
            period = date.toISOString().slice(0, 7) // YYYY-MM
            label = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            })
          } else {
            const year = date.getFullYear()
            const month = date.toLocaleString("default", { month: "2-digit" }) // MM
            const day = date.toLocaleString("default", { day: "2-digit" }) // DD
            const weekNumber = date.getDate() > 15 ? 2 : 1
            period = `${year}-${month}-${day}` // YYYY-MM-DD
            label = `${month}-Q. ${weekNumber}`
          }

          if (!acc[period]) {
            acc[period] = {
              expected: 0, // Initialize expected to 0 if not exist
              amount: 0,
              label: label, // Store the label with the period
            }
          }
          acc[period].amount += amount ?? 0
        })
        return acc
      },
      {} as Record<string, { amount: number; label: string; expected: number }>,
    )

    const sortedPeriods = Object.keys(deductionsByPeriod).sort()

    return sortedPeriods.map((period) => ({
      period,
      amount: deductionsByPeriod[period].amount,
      label: deductionsByPeriod[period].label,
      expected: deductionsByPeriod[period].expected, // Use the accumulated expected value
    }))
  }, [dispersedCredits, company])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Descuentos</CardTitle>
        <CardDescription>
          Mostrando descuentos de lo últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={dispersedAmountByFreq}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Line
              dataKey="amount"
              type="monotone"
              strokeWidth={2}
              stroke="hsl(var(--chart-1))"
              dot={false}
            />
            <Line
              dataKey="expected"
              type="monotone"
              strokeWidth={2}
              stroke="hsl(var(--chart-2))"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {dayjs(dispersedAmountByFreq.at(0)?.period).format("MMM")} -{" "}
              {dayjs(dispersedAmountByFreq.at(-1)?.period).format("MMM - YYYY")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

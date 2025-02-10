import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
import { companySelectorQuery } from "../loader" // Import your company query
import dayjs from "dayjs"

const chartConfig = {
  loaned: {
    label: "Dispersiones",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function DispersedByFrequencyChart() {
  const { id } = useParams()
  if (!id) throw new Error("Missing company id param")
  const installedCredits = useRecoilValue(companyInstalledCreditsQuery(id))
  const company = useRecoilValue(companySelectorQuery(id))

  const dispersedAmountByPeriod = useMemo(() => {
    if (!company) return []

    const creditsByPeriod = installedCredits.reduce(
      (acc, { createdAt, loan }) => {
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
          label = `${month}-Q${weekNumber}`
        }

        if (!acc[period]) {
          acc[period] = {
            loaned: 0,
            label: label, // Store the label with the period
          }
        }
        acc[period].loaned += loan ?? 0 // Add to the loaned amount
        return acc
      },
      {} as Record<string, { loaned: number; label: string }>,
    )

    const sortedPeriods = Object.keys(creditsByPeriod).sort()

    return sortedPeriods.map((period) => ({
      period,
      loaned: creditsByPeriod[period].loaned,
      label: creditsByPeriod[period].label, // Retrieve the label
    }))
  }, [installedCredits, company]) // company is now a dependency

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispersiones</CardTitle>
        <CardDescription>
          Mostrando dispersiones de lo últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={dispersedAmountByPeriod}
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
            <Area dataKey="loaned" type="linear" fillOpacity={0.4} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {dayjs(dispersedAmountByPeriod.at(0)?.period).format("MMM")} -{" "}
              {dayjs(dispersedAmountByPeriod.at(-1)?.period).format(
                "MMM - YYYY",
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

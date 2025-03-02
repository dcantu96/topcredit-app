import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
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
import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { companyInstalledCreditsQuery } from "./loader"
import dayjs from "dayjs"
import { useMemo } from "react"

const chartConfig = {
  active: {
    label: "Activos",
    color: "hsl(var(--chart-1))",
  },
  delayed: {
    label: "Demorados",
    color: "hsl(var(--chart-2))",
  },
  defaulted: {
    label: "Cartera Vencida",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export default function ByClientStatusPieChart() {
  const { id } = useParams()
  if (!id) throw new Error("Missing company id param")
  const credits = useRecoilValue(companyInstalledCreditsQuery(id))

  const activeCredits = useMemo(
    () =>
      credits.filter((credit) => {
        const dispersed = credit.status === "dispersed"
        const isOnePaymentMissing = credit.payments.find(
          (payment) =>
            !payment.paidAt && dayjs(payment.expectedAt).isBefore(dayjs()),
        )
        return dispersed && isOnePaymentMissing
      }),
    [credits],
  )

  const defaultedCredits = useMemo(
    () => credits.filter((credit) => credit.status === "defaulted"),
    [credits],
  )

  const delayedCredits = useMemo(
    () =>
      credits.filter((credit) =>
        credit.payments.find(
          (payment) =>
            !payment.paidAt && dayjs(payment.expectedAt).isBefore(dayjs()),
        ),
      ),
    [credits],
  )

  const chartData = [
    {
      status: "active",
      amount: activeCredits.length,
      fill: "var(--color-active)",
    },
    {
      status: "delayed",
      amount: delayedCredits.length,
      fill: "var(--color-delayed)",
    },
    {
      status: "defaulted",
      amount: defaultedCredits.length,
      fill: "var(--color-defaulted)",
    },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Clientes Por Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {credits.length.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total de Créditos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

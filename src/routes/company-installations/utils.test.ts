import { describe, it, expect, vi } from "vitest"
import { fetchNextPayrollDate } from "./utils"

describe("fetchNextPayrollDate function", () => {
  it("should return the last day of the month for monthly payrolls depending on the current date", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2022-10-01T12:00:00Z"))
    expect(fetchNextPayrollDate("monthly")).toStrictEqual(
      new Date("2022-10-31T06:00:00.000Z"),
    )
    vi.setSystemTime(new Date("2023-04-18T12:00:00Z"))
    expect(fetchNextPayrollDate("monthly")).toStrictEqual(
      new Date("2023-04-30T06:00:00.000Z"),
    )
    vi.setSystemTime(new Date("2023-05-15T12:00:00Z"))
    expect(fetchNextPayrollDate("monthly")).toStrictEqual(
      new Date("2023-05-31T06:00:00.000Z"),
    )
    vi.useRealTimers()
  })

  it("should return the 15th of the current month for biweekly payrolls if the current day is less than or equal to 15", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2022-11-01T12:00:00Z"))
    expect(fetchNextPayrollDate("biweekly")).toStrictEqual(
      new Date("2022-11-15T06:00:00.000Z"),
    )
    vi.setSystemTime(new Date("2023-04-13T12:00:00Z"))
    expect(fetchNextPayrollDate("biweekly")).toStrictEqual(
      new Date("2023-04-15T06:00:00.000Z"),
    )
    vi.useRealTimers()
  })

  it("should return the last day of the month for biweekly payrolls if the current day is greater than 15", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2022-11-19T12:00:00Z"))
    expect(fetchNextPayrollDate("biweekly")).toStrictEqual(
      new Date("2022-11-30T06:00:00.000Z"),
    )
    vi.setSystemTime(new Date("2023-04-16T12:00:00Z"))
    expect(fetchNextPayrollDate("biweekly")).toStrictEqual(
      new Date("2023-04-30T06:00:00.000Z"),
    )
    vi.useRealTimers()
  })
})

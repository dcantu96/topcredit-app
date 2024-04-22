import { describe, it, expect, vi } from "vitest"
import {
  expectedPaymentsByDate,
  fetchNextPayrollDate,
  getNextPaymentDate,
} from "./utils"

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

  it("should return valid dates for specific dates passed as values", () => {
    expect(
      fetchNextPayrollDate("biweekly", "2022-11-01T12:00:00Z"),
    ).toStrictEqual(new Date("2022-11-15T06:00:00.000Z"))
    expect(
      fetchNextPayrollDate("biweekly", "2023-04-13T12:00:00Z"),
    ).toStrictEqual(new Date("2023-04-15T06:00:00.000Z"))
    expect(
      fetchNextPayrollDate("biweekly", "2022-11-19T12:00:00Z"),
    ).toStrictEqual(new Date("2022-11-30T06:00:00.000Z"))
    expect(
      fetchNextPayrollDate("biweekly", "2023-04-16T12:00:00Z"),
    ).toStrictEqual(new Date("2023-04-30T06:00:00.000Z"))
  })
})

describe("getNextPaymentDate function", () => {
  it("should return the next expected payment date for biweekly payrolls", () => {
    expect(
      getNextPaymentDate(new Date("2022-11-15T12:00:00.000Z"), "biweekly"),
    ).toStrictEqual(new Date("2022-11-30T06:00:00.000Z"))
    expect(
      getNextPaymentDate(new Date("2023-04-15T12:00:00.000Z"), "biweekly"),
    ).toStrictEqual(new Date("2023-04-30T06:00:00.000Z"))
    expect(
      getNextPaymentDate(new Date("2022-11-30T12:00:00.000Z"), "biweekly"),
    ).toStrictEqual(new Date("2022-12-15T06:00:00.000Z"))
    expect(
      getNextPaymentDate(new Date("2023-04-30T12:00:00.000Z"), "biweekly"),
    ).toStrictEqual(new Date("2023-05-15T06:00:00.000Z"))
  })

  it("should return the next expected payment date for monthly payrolls", () => {
    expect(
      getNextPaymentDate(new Date("2022-10-31T12:00:00.000Z"), "monthly"),
    ).toStrictEqual(new Date("2022-11-30T06:00:00.000Z"))
    expect(
      getNextPaymentDate(new Date("2023-04-30T12:00:00.000Z"), "monthly"),
    ).toStrictEqual(new Date("2023-05-31T06:00:00.000Z"))
    expect(
      getNextPaymentDate(new Date("2022-11-30T12:00:00.000Z"), "monthly"),
    ).toStrictEqual(new Date("2022-12-31T06:00:00.000Z"))
    expect(
      getNextPaymentDate(new Date("2023-05-31T12:00:00.000Z"), "monthly"),
    ).toStrictEqual(new Date("2023-06-30T06:00:00.000Z"))
  })
})

describe("expectedPaymentsByDate function", () => {
  it("should return the expected number of payments by a specific date for monthly payrolls", () => {
    expect(
      expectedPaymentsByDate(
        "2024-04-21T12:00:00.000Z",
        "monthly",
        "2023-06-29T12:00:00.000Z",
        14,
      ),
    ).toBe(10)
    expect(
      expectedPaymentsByDate(
        "2024-04-21T12:00:00.000Z",
        "monthly",
        "2023-02-14T12:00:00.000Z",
        8,
      ),
    ).toBe(8)
    expect(
      expectedPaymentsByDate(
        "2024-04-21T12:00:00.000Z",
        "biweekly",
        "2024-01-13T12:00:00.000Z",
        45,
      ),
    ).toBe(7)
  })
})

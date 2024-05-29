import { describe, it, expect } from "vitest"
import {
  calculateMaxDebtCapacity,
  calculateMaxLoanAmount,
  calculateAmortization,
  calculatePaymentNumber,
} from "./index"

// Assuming your-file.ts contains the original functions

describe("calculateMaxDebtCapacity", () => {
  it("should correctly calculate the max debt capacity", () => {
    const salary = 50_000
    const companyMaxRateCapacity = 0.35
    const result = calculateMaxDebtCapacity({ salary, companyMaxRateCapacity })
    expect(result).toBeCloseTo(17_500, 2)
  })

  it("should handle zero salary", () => {
    const salary = 0
    const companyMaxRateCapacity = 0.35
    const result = calculateMaxDebtCapacity({ salary, companyMaxRateCapacity })
    expect(result).toBe(0)
  })
})

describe("calculateMaxLoanAmount", () => {
  it("should correctly calculate the max loan amount", () => {
    const maxDebtCapacity = 17_500
    const payments = 12
    const rate = 0.05
    const result = calculateMaxLoanAmount({ maxDebtCapacity, payments, rate })
    expect(result).toBeCloseTo(198_487.71, 2)
  })

  it("should handle zero max debt capacity", () => {
    const maxDebtCapacity = 0
    const payments = 12
    const rate = 0.05
    const result = calculateMaxLoanAmount({ maxDebtCapacity, payments, rate })
    expect(result).toBe(0)
  })
})

describe("calculateAmortization", () => {
  it("should correctly calculate the amortization", () => {
    const loanAmount = 20_000
    const totalPayments = 12
    const rate = 0.05
    const result = calculateAmortization({ loanAmount, totalPayments, rate })
    expect(result).toBeCloseTo(1_763.33, 2)
  })

  it("should handle zero loan amount", () => {
    const loanAmount = 0
    const totalPayments = 12
    const rate = 0.05
    const result = calculateAmortization({ loanAmount, totalPayments, rate })
    expect(result).toBe(0)
  })
})

describe("calculatePaymentNumber", () => {
  it("should calculate the payment number", () => {
    let installationDateString = "2023-04-15T06:00:00.000Z"

    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 4,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 1,
      }),
    ).toBe(1)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 4,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 2,
      }),
    ).toBe(2)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 5,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 1,
      }),
    ).toBe(3)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 5,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 2,
      }),
    ).toBe(4)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 6,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 1,
      }),
    ).toBe(5)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 6,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 2,
      }),
    ).toBe(6)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 7,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 1,
      }),
    ).toBe(7)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 7,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 2,
      }),
    ).toBe(8)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 8,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 1,
      }),
    ).toBe(9)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 8,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 2,
      }),
    ).toBe(10)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 9,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 1,
      }),
    ).toBe(11)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 9,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 2,
      }),
    ).toBe(12)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 10,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 1,
      }),
    ).toBe(12)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 10,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 2,
      }),
    ).toBe(12)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 1,
        installationDateString,
        termDuration: 12,
        twoWeekPeriod: 2,
      }),
    ).toBe(12)

    installationDateString = "2024-02-29T06:00:00.000Z"

    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 2,
        installationDateString,
        termDuration: 6,
        twoWeekPeriod: 2,
      }),
    ).toBe(1)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 3,
        installationDateString,
        termDuration: 6,
        twoWeekPeriod: 1,
      }),
    ).toBe(2)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 3,
        installationDateString,
        termDuration: 6,
        twoWeekPeriod: 2,
      }),
    ).toBe(3)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 4,
        installationDateString,
        termDuration: 6,
        twoWeekPeriod: 1,
      }),
    ).toBe(4)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 4,
        installationDateString,
        termDuration: 6,
        twoWeekPeriod: 2,
      }),
    ).toBe(5)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 5,
        installationDateString,
        termDuration: 6,
        twoWeekPeriod: 1,
      }),
    ).toBe(6)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 5,
        installationDateString,
        termDuration: 6,
        twoWeekPeriod: 2,
      }),
    ).toBe(6)
  })

  it("calculates monthly payments correctly", () => {
    const installationDateString = "2023-04-30T06:00:00.000Z"

    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 4,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(1)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 5,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(2)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 6,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(3)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 7,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(4)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 8,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(5)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 9,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(6)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 10,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(7)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 11,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(8)
    expect(
      calculatePaymentNumber({
        year: 2023,
        month: 12,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(9)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 1,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(10)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 2,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(11)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 3,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(12)
    expect(
      calculatePaymentNumber({
        year: 2024,
        month: 4,
        installationDateString,
        termDuration: 12,
      }),
    ).toBe(12)
  })
})

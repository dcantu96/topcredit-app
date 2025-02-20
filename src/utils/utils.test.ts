import { describe, it, expect } from "vitest"
import {
  calculateMaxDebtCapacity,
  calculateMaxLoanAmount,
  calculateAmortization,
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

import Button from "./button"
import userEvent from "@testing-library/user-event"
import { render } from "@testing-library/react"
import { describe, test, expect, vi } from "vitest"

describe("Button test", () => {
  test("Should render the specified label and register the click", async () => {
    const onClick = vi.fn()
    const label = "This is a button"

    const { findByRole } = render(<Button onClick={onClick}>{label}</Button>)
    const button = await findByRole("button", { name: label })
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

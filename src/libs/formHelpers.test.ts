import { placeholder, step } from "./formHelpers"

test("placeholder", () => {
  expect(placeholder("uusd")).toBe("0.00")
  expect(placeholder("mAsset")).toBe("0.000000")
})

test("step", () => {
  expect(step("uusd")).toBe("0.01")
  expect(step("mAsset")).toBe("0.000001")
})

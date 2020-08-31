import { percent } from "./num"

test("percent", () => {
  expect(percent("0.012358")).toBe("1.23%")
})

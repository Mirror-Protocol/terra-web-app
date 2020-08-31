import { Dictionary } from "ramda"
import { format, lookup, lookupSymbol, toAmount, validateDp } from "./parse"

test("validateDp", () => {
  expect(validateDp("1.23", "uusd")).toBeTruthy()
  expect(validateDp("1.234567", "uusd")).toBeFalsy()
  expect(validateDp("1.23", "mAAPL")).toBeTruthy()
  expect(validateDp("1.234567", "mAAPL")).toBeTruthy()
})

describe.each`
  value                | lookup:uusd     | lookup:mirror      | format:uusd     | format:mirror
  ${"9999"}            | ${"0"}          | ${"0.009999"}      | ${"0"}          | ${"0.009999"}
  ${"99999"}           | ${"0.09"}       | ${"0.099999"}      | ${"0.09"}       | ${"0.099999"}
  ${"1000000"}         | ${"1"}          | ${"1"}             | ${"1"}          | ${"1"}
  ${"1239999"}         | ${"1.23"}       | ${"1.239999"}      | ${"1.23"}       | ${"1.239999"}
  ${"1000000000"}      | ${"1000"}       | ${"1000"}          | ${"1,000"}      | ${"1,000"}
  ${"1234567890"}      | ${"1234.56"}    | ${"1234.56789"}    | ${"1,234.56"}   | ${"1,234.56789"}
  ${"999999999999"}    | ${"999999.99"}  | ${"999999.999999"} | ${"999,999.99"} | ${"999,999.999999"}
  ${"1000000000000"}   | ${"1000000"}    | ${"1000000"}       | ${"1M"}         | ${"1M"}
  ${"1234567890000"}   | ${"1234567.89"} | ${"1234567.89"}    | ${"1.23M"}      | ${"1.23M"}
  ${"1239999999999"}   | ${"1239999.99"} | ${"1239999.99"}    | ${"1.23M"}      | ${"1.23M"}
  ${"100000000000000"} | ${"100000000"}  | ${"100000000"}     | ${"100M"}       | ${"100M"}
  ${"123456789000000"} | ${"123456789"}  | ${"123456789"}     | ${"123.45M"}    | ${"123.45M"}
`("parse $amount", ({ value, ...rest }) => {
  type Parser = (value: string, symbol: string) => string
  const parse: Dictionary<Parser> = { format, lookup }
  const entries = Object.entries(rest)
  test.each(entries)(`%s(${value}) returns %i`, (params, expected) => {
    const [parser, symbol] = params.split(":")
    expect(parse[parser](value, symbol)).toBe(expected)
  })
})

test("format", () => {
  expect(format("1")).toBe("1")
  expect(format("1.234567")).toBe("1.23")
  expect(format("1234.567")).toBe("1,234.56")
})

test("lookup", () => {
  expect(lookup("1")).toBe("1")
  expect(lookup("1.234567")).toBe("1.23")
  expect(lookup("1234.567")).toBe("1234.56")
})

test("lookupSymbol", () => {
  expect(lookupSymbol("uusd")).toBe("UST")
  expect(lookupSymbol("mAAPL")).toBe("mAAPL")
})

test("toAmount", () => {
  expect(toAmount("1.234567")).toBe("1234567")
})

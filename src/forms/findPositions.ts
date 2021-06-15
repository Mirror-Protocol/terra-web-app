import { compose, descend, prop, sortWith } from "ramda"
import { gte, lte, minus, number, sum } from "../libs/math"

const sortPositions = sortWith<CDP>([
  descend(compose((token) => token === "uusd", prop("collateralToken"))),
  descend(compose(number, prop("mintAmount"))),
])

const findPositions = (balance: string, cdps: CDP[]) => {
  const sorted = sortPositions(cdps)
  return sorted.reduce<CDP[]>((acc, cur) => {
    const accTotal = sum(acc.map(({ mintAmount }) => mintAmount))
    return gte(accTotal, balance)
      ? acc
      : lte(minus(balance, accTotal), cur.mintAmount)
      ? [...acc, { ...cur, mintAmount: minus(balance, accTotal) }]
      : [...acc, cur]
  }, [])
}

export default findPositions

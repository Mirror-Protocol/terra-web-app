import { selector, useRecoilValue } from "recoil"
import { minus, number, sum } from "../../libs/math"
import { protocolQuery } from "../contract/protocol"
import { lockPositionInfoQuery } from "../contract/lock"
import { mintPositionsQuery } from "../contract/positions"

export const myLockedUSTQuery = selector({
  key: "myLockedUST",
  get: ({ get }) => {
    const { whitelist, parseAssetInfo } = get(protocolQuery)
    const mintPositions = get(mintPositionsQuery)
    const lockPositionInfo = get(lockPositionInfoQuery)

    const values = Object.values(lockPositionInfo).sort(
      ({ idx: a }, { idx: b }) => number(minus(b, a))
    )

    const dataSource = values.map((item) => {
      const position = mintPositions.find(({ idx }) => idx === item.idx)!
      const { token } = parseAssetInfo(position.asset.info)
      const { locked_amount, unlock_time } = item
      const isUnlocked = unlock_time * 1000 < Date.now()
      const locked = isUnlocked ? "0" : locked_amount
      const unlocked = isUnlocked ? locked_amount : "0"

      return { ...item, ...whitelist[token], locked, unlocked }
    })

    const totalLockedUST = sum(dataSource.map(({ locked }) => locked))
    const totalUnlockedUST = sum(dataSource.map(({ unlocked }) => unlocked))

    return { totalLockedUST, totalUnlockedUST, dataSource }
  },
})

export const useMyLockedUST = () => {
  return useRecoilValue(myLockedUSTQuery)
}

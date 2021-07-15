import { minus, number, sum } from "../../libs/math"
import { useProtocol } from "../contract/protocol"
import { useLockPositionInfo } from "../contract/lock"
import { useMintPositions } from "../contract/positions"

export const useMyLockedUST = () => {
  const { whitelist, parseAssetInfo } = useProtocol()
  const { contents: mintPositions } = useMintPositions()
  const lockPositionInfo = useLockPositionInfo()

  const values = Object.values(lockPositionInfo).sort(
    ({ idx: a }, { idx: b }) => number(minus(b, a))
  )

  const dataSource = values
    .filter(({ idx }) => mintPositions.some((item) => idx === item.idx))
    .map((item) => {
      const position = mintPositions.find(({ idx }) => idx === item.idx)
      const { token } = parseAssetInfo(position!.asset.info)
      const { locked_amount, unlock_time } = item
      const isUnlocked = unlock_time * 1000 < Date.now()
      const locked = isUnlocked ? "0" : locked_amount
      const unlocked = isUnlocked ? locked_amount : "0"

      return { ...item, ...whitelist[token], locked, unlocked }
    })

  const totalLockedUST = sum(dataSource.map(({ locked }) => locked))
  const totalUnlockedUST = sum(dataSource.map(({ unlocked }) => unlocked))

  return { totalLockedUST, totalUnlockedUST, dataSource }
}

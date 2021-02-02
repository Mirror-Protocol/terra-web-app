import { UUSD } from "../../constants"
import { lt, lte, minus, sum, times } from "../../libs/math"
import { useContractsAddress, useContract, useCombineKeys } from "../../hooks"
import { AssetInfoKey } from "../../hooks/contractKeys"
import { PriceKey } from "../../hooks/contractKeys"
import calc from "../../helpers/calc"
import useYesterday, { calcChange } from "../../statistics/useYesterday"
import useMintPositions from "../../graphql/queries/useMintPositions"

const WARNING = 0.3
const DANGER = 0

const useMyMint = () => {
  const priceKey = PriceKey.ORACLE
  const keys = [priceKey, AssetInfoKey.MINCOLLATERALRATIO]

  const { loading, data } = useCombineKeys(keys)
  const { whitelist, parseToken } = useContractsAddress()
  const { find } = useContract()
  const { [priceKey]: yesterday } = useYesterday()
  const { positions, more } = useMintPositions()

  const dataSource =
    !data || !positions
      ? []
      : positions.map((position) => {
          /* collateral */
          const collateral = parseToken(position.collateral)
          const collateralPrice = find(priceKey, collateral.token)
          const collateralValue = times(collateral.amount, collateralPrice)
          const collateralChange = calcChange({
            today: collateralPrice,
            yesterday: yesterday[collateral.token],
          })

          /* asset */
          const asset = parseToken(position.asset)
          const assetPrice = find(priceKey, asset.token)
          const assetValue = times(asset.amount, assetPrice)
          const assetChange = calcChange({
            today: assetPrice,
            yesterday: yesterday[asset.token],
          })

          /* ratio */
          const minRatio = find(AssetInfoKey.MINCOLLATERALRATIO, asset.token)

          const { ratio } = calc.mint({
            collateral: { ...collateral, price: collateralPrice },
            asset: { ...asset, price: assetPrice },
          })

          const danger = lt(minus(ratio, minRatio), DANGER)
          const warning = !danger && lte(minus(ratio, minRatio), WARNING)

          return {
            ...position,
            collateral: {
              ...collateral,
              price: collateralPrice,
              value: collateralValue,
              change: collateralChange,
              delisted:
                collateral.token !== UUSD &&
                whitelist[collateral.token]["status"] === "DELISTED",
            },
            asset: {
              ...asset,
              price: assetPrice,
              value: assetValue,
              change: assetChange,
              delisted: whitelist[asset.token]["status"] === "DELISTED",
            },
            ratio,
            minRatio,
            danger,
            warning,
          }
        })

  const totalCollateralValue = sum(
    dataSource.map(({ collateral }) => collateral.value)
  )

  const totalMintedValue = sum(dataSource.map(({ asset }) => asset.value))

  return {
    keys,
    loading,
    dataSource,
    totalCollateralValue,
    totalMintedValue,
    more,
  }
}

export default useMyMint

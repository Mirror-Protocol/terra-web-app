import { selector, useRecoilValue } from "recoil"
import { gte, lt, lte, minus, sum, times } from "../../libs/math"
import calc from "../../libs/calc"
import { findChangeQuery } from "../stats/assets"
import { protocolQuery } from "../contract/protocol"
import { findQuery } from "../contract/normalize"
import { mintPositionsQuery } from "../contract/positions"
import { getMinRatioQuery, getMintPriceKeyQuery } from "../contract/collateral"

const WARNING = 0.3
const DANGER = 0

export const myBorrowingQuery = selector({
  key: "myBorrowing",
  get: ({ get }) => {
    const { getIsDelisted, parseToken } = get(protocolQuery)
    const find = get(findQuery)
    const findChange = get(findChangeQuery)
    const positions = get(mintPositionsQuery)
    const getMinRatio = get(getMinRatioQuery)
    const getPriceKey = get(getMintPriceKeyQuery)

    const dataSource = positions
      .map((position) => {
        /* collateral */
        const collateral = parseToken(position.collateral)
        const collateralPriceKey = getPriceKey(collateral.token)
        const collateralDelisted = getIsDelisted(collateral.token)
        const collateralPrice = find(collateralPriceKey, collateral.token)
        const collateralValue = times(collateral.amount, collateralPrice)
        const collateralChange = findChange(collateralPriceKey)(
          collateral.token,
          collateralPrice
        )

        /* asset */
        const asset = parseToken(position.asset)
        const assetPriceKey = getPriceKey(asset.token)
        const assetDelisted = getIsDelisted(asset.token)
        const assetPrice = find(assetPriceKey, asset.token)
        const assetValue = times(asset.amount, assetPrice)
        const assetChange = findChange(assetPriceKey)(asset.token, assetPrice)

        /* ratio */
        const minRatio = getMinRatio(collateral.token, asset.token)

        const { ratio } = calc.mint({
          collateral: { ...collateral, price: collateralPrice },
          asset: { ...asset, price: assetPrice },
        })

        const danger = lt(minus(ratio, minRatio), DANGER)
        const warning = !danger && lte(minus(ratio, minRatio), WARNING)

        /* status */
        const status: ListedItemStatus =
          collateralDelisted || assetDelisted ? "DELISTED" : "LISTED"

        return {
          ...position,
          status,
          collateralAsset: {
            ...collateral,
            price: collateralPrice,
            value: collateralValue,
            change: collateralChange,
            delisted: collateralDelisted,
          },
          mintedAsset: {
            ...asset,
            price: assetPrice,
            value: assetValue,
            change: assetChange,
            delisted: assetDelisted,
          },
          ratio,
          minRatio,
          danger,
          warning,
        }
      })
      .filter(({ collateralAsset, mintedAsset }) => {
        const invalid =
          !gte(collateralAsset.value, 10000) && !gte(mintedAsset.value, 10000)

        return !invalid
      })

    const totalCollateralValue = sum(
      dataSource.map(({ collateralAsset }) => collateralAsset.value)
    )

    const totalMintedValue = sum(
      dataSource.map(({ mintedAsset }) => mintedAsset.value)
    )

    return { dataSource, totalCollateralValue, totalMintedValue }
  },
})

export const useMyBorrowing = () => {
  return useRecoilValue(myBorrowingQuery)
}

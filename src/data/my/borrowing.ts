import { atom, selector } from "recoil"
import { gte, sum, times } from "../../libs/math"
import calc from "../../libs/calc"
import { useStoreLoadable } from "../utils/loadable"
import { protocolQuery } from "../contract/protocol"
import { findQuery } from "../contract/normalize"
import { mintPositionsQuery } from "../contract/positions"
import { getMintPriceKeyQuery } from "../contract/collateral"

export const myBorrowingQuery = selector({
  key: "myBorrowing",
  get: ({ get }) => {
    const { getIsDelisted, parseToken } = get(protocolQuery)
    const positions = get(mintPositionsQuery)

    const find = get(findQuery)
    const getPriceKey = get(getMintPriceKeyQuery)

    const dataSource = positions
      .map((position) => {
        /* collateral */
        const collateral = parseToken(position.collateral)
        const collateralPriceKey = getPriceKey(collateral.token)
        const collateralDelisted = getIsDelisted(collateral.token)
        const collateralPrice = find(collateralPriceKey, collateral.token)
        const collateralValue = times(collateral.amount, collateralPrice)

        /* asset */
        const asset = parseToken(position.asset)
        const assetPriceKey = getPriceKey(asset.token)
        const assetDelisted = getIsDelisted(asset.token)
        const assetPrice = find(assetPriceKey, asset.token)
        const assetValue = times(asset.amount, assetPrice)

        /* ratio */
        const { ratio } = calc.mint({
          collateral: { ...collateral, price: collateralPrice },
          asset: { ...asset, price: assetPrice },
        })

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
            delisted: collateralDelisted,
          },
          mintedAsset: {
            ...asset,
            price: assetPrice,
            value: assetValue,
            delisted: assetDelisted,
          },
          ratio,
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

const myBorrowingState = atom({
  key: "myBorrowingState",
  default: myBorrowingQuery,
})

export const useMyBorrowing = () => {
  return useStoreLoadable(myBorrowingQuery, myBorrowingState)
}

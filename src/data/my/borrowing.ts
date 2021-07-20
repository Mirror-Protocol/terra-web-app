import { useRecoilValue } from "recoil"
import { gte, lte, minus, sum, times } from "../../libs/math"
import calc from "../../libs/calc"
import { useProtocol } from "../contract/protocol"
import { useFindPrice } from "../contract/normalize"
import { useMintPositions } from "../contract/positions"
import { getMintPriceKeyQuery } from "../contract/collateral"
import { useGetMinRatio } from "../contract/collateral"
import { getState } from "../../forms/modules/CollateralRatio"

export const useMyBorrowing = () => {
  const { getIsDelisted, parseToken } = useProtocol()
  const getPriceKey = useRecoilValue(getMintPriceKeyQuery)
  const { contents: positions, isLoading } = useMintPositions()
  const findPrice = useFindPrice()
  const getMinRatio = useGetMinRatio()

  const dataSource = positions
    .map((position) => {
      /* collateral */
      const collateral = parseToken(position.collateral)
      const collateralPriceKey = getPriceKey(collateral.token)
      const collateralDelisted = getIsDelisted(collateral.token)
      const collateralPrice = findPrice(collateralPriceKey, collateral.token)
      const collateralValue = times(collateral.amount, collateralPrice)

      /* asset */
      const asset = parseToken(position.asset)
      const assetPriceKey = getPriceKey(asset.token)
      const assetDelisted = getIsDelisted(asset.token)
      const assetPrice = findPrice(assetPriceKey, asset.token)
      const assetValue = times(asset.amount, assetPrice)

      /* ratio */
      const { ratio } = calc.mint({
        collateral: { ...collateral, price: collateralPrice },
        asset: { ...asset, price: assetPrice },
      })

      const minRatio = getMinRatio(collateral.token, asset.token)
      const diffRatio = minus(ratio, minRatio)
      const state = getState(diffRatio)

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
        minRatio,
        state,
        willBeLiquidated: lte(diffRatio, 0),
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

  return { dataSource, totalCollateralValue, totalMintedValue, isLoading }
}

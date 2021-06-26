import { selector } from "recoil"
import { gt, times } from "../../libs/math"
import { decimal } from "../../libs/parse"
import { PriceKey } from "../../hooks/contractKeys"
import { whitelistExternalQuery } from "../external/external"
import { getTokensContractQueriesQuery } from "../utils/queries"
import { useMinCollateralRatio, useMultipliers } from "./normalize"
import { protocolQuery, useProtocol } from "./protocol"

export const getMintPriceKeyQuery = selector({
  key: "getMintPriceKey",
  get: ({ get }) => {
    const { getSymbol, ...helpers } = get(protocolQuery)
    const { getIsPreIPO, getIsDelisted, getIsExternal } = helpers

    return (token: string) =>
      getIsExternal(token)
        ? PriceKey.EXTERNAL
        : getSymbol(token) === "MIR"
        ? PriceKey.PAIR
        : getIsPreIPO(token)
        ? PriceKey.PRE
        : getIsDelisted(token)
        ? PriceKey.END
        : PriceKey.ORACLE
  },
})

export const collateralOracleAssetInfoQuery = selector({
  key: "collateralOracleAssetInfo",
  get: async ({ get }) => {
    const { contracts, listed } = get(protocolQuery)
    const whitelistExternal = get(whitelistExternalQuery)

    const tokens = [
      "uluna",
      ...listed
        .filter(({ status }) => status !== "PRE_IPO")
        .map(({ token }) => token),
      ...Object.keys(whitelistExternal),
    ]

    const getListedContractQueries = get(getTokensContractQueriesQuery(tokens))
    return await getListedContractQueries<CollateralOracleAssetInfo>(
      (token) => ({
        contract: contracts["collateralOracle"],
        msg: { collateral_asset_info: { asset: token } },
      }),
      "collateralOracleAssetInfo"
    )
  },
})

/* find */
export const useGetMinRatio = () => {
  const { getIsDelisted } = useProtocol()
  const minCollateralRatio = useMinCollateralRatio()
  const multipliers = useMultipliers()

  return (collateralToken: string, assetToken: string) => {
    const minRatio = minCollateralRatio[assetToken]
    const multiplier = multipliers[collateralToken]
    const valid = gt(minRatio, 0) && gt(multiplier, 0)

    return !valid
      ? "0"
      : getIsDelisted(assetToken)
      ? minRatio
      : decimal(times(minRatio, multiplier), 4)
  }
}

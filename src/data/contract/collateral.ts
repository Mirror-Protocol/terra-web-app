import { selector } from "recoil"
import { DEFAULT_MIN_RATIO, DEFAULT_MULTIPLIER } from "../../constants"
import { times } from "../../libs/math"
import { decimal } from "../../libs/parse"
import { AssetInfoKey, PriceKey } from "../../hooks/contractKeys"
import { whitelistExternal } from "../external/external"
import { getTokensContractQueriesQuery } from "../utils/queries"
import { findAssetInfoQuery } from "./normalize"
import { protocolQuery } from "./protocol"

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

export const getMinRatioQuery = selector({
  key: "getMinRatio",
  get: ({ get }) => {
    const { getIsDelisted } = get(protocolQuery)
    const findAssetInfo = get(findAssetInfoQuery)

    return (collateralToken: string, assetToken: string) => {
      const minRatio =
        findAssetInfo(AssetInfoKey.MINCOLLATERALRATIO, assetToken) ??
        String(DEFAULT_MIN_RATIO)

      const multiplier =
        findAssetInfo(AssetInfoKey.MULTIPLIER, collateralToken) ??
        String(DEFAULT_MULTIPLIER)

      return getIsDelisted(assetToken)
        ? minRatio
        : decimal(times(minRatio, multiplier), 4)
    }
  },
})

export const collateralOracleAssetInfoQuery = selector({
  key: "collateralOracleAssetInfo",
  get: async ({ get }) => {
    const { contracts, listed } = get(protocolQuery)
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

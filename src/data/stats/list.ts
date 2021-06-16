import { atom, selector } from "recoil"
import { PriceKey } from "../../hooks/contractKeys"
import { div, gt, minus } from "../../libs/math"
import { protocolQuery } from "../contract/protocol"
import { useStoreLoadable } from "../utils/loadable"
import { assetsByNetworkState, getAssetsHelpers } from "./assets"
import { StatsNetwork } from "./statistic"

type FarmingType = "long" | "short"

export interface DefaultItem extends ListedItem {
  [PriceKey.PAIR]: string
  [PriceKey.ORACLE]?: string
  premium?: string

  liquidity: string
  volume: string
  apr: { long: string; short?: string }

  recommended: FarmingType
}

export interface Item extends DefaultItem {
  change?: { [PriceKey.PAIR]?: number; [PriceKey.ORACLE]?: number }
}

export const getTerraAssetItemQuery = selector({
  key: "getTerraAssetItem",
  get: ({ get }) => {
    const assets = get(assetsByNetworkState(StatsNetwork.TERRA))
    const helpers = getAssetsHelpers(assets)

    return (item: ListedItem): DefaultItem => {
      const { [PriceKey.PAIR]: getPair, [PriceKey.ORACLE]: getOracle } = helpers
      const { volume, liquidity, longAPR, shortAPR } = helpers
      const { token } = item
      const pairPrice = getPair(token)
      const oraclePrice = getOracle(token)
      const long = longAPR(token)
      const short = shortAPR(token)

      return {
        ...item,
        [PriceKey.PAIR]: pairPrice,
        [PriceKey.ORACLE]: oraclePrice,
        premium: oraclePrice
          ? minus(div(pairPrice, oraclePrice), 1)
          : undefined,
        volume: volume(token),
        liquidity: liquidity(token),
        apr: { long, short },
        recommended: long && short && gt(short, long) ? "short" : "long",
      }
    }
  },
})

export const TerraAssetListQuery = selector({
  key: "TerraAssetList",
  get: ({ get }) => {
    const { listed } = get(protocolQuery)
    const getAssetItem = get(getTerraAssetItemQuery)

    return listed
      .map(getAssetItem)
      .filter(({ liquidity }) => !liquidity || gt(liquidity, 0))
  },
})

/* state */
export const TerraAssetListState = atom<DefaultItem[]>({
  key: "TerraAssetListState",
  default: [], // idle
})

export const useTerraAssetList = () => {
  return useStoreLoadable(TerraAssetListQuery, TerraAssetListState)
}

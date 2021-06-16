import { atom, selector } from "recoil"
import { PriceKey } from "../../hooks/contractKeys"
import { div, gt, minus } from "../../libs/math"
import { protocolQuery } from "../contract/protocol"
import { useStoreLoadable } from "../utils/loadable"
import { assetsHelpersQuery } from "./assets"
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

export const getAssetItemQuery = selector({
  key: "getAssetItem",
  get: ({ get }) => {
    const helpers = get(assetsHelpersQuery(StatsNetwork.TERRA))

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

export const assetListQuery = selector({
  key: "assetList",
  get: ({ get }) => {
    const { listed } = get(protocolQuery)
    const getAssetItem = get(getAssetItemQuery)

    return listed
      .map(getAssetItem)
      .filter(({ liquidity }) => !liquidity || gt(liquidity, 0))
  },
})

/* state */
export const assetListState = atom<DefaultItem[] | undefined>({
  key: "assetListState",
  default: undefined,
})

export const useAssetList = () => {
  return useStoreLoadable(assetListQuery, assetListState)
}

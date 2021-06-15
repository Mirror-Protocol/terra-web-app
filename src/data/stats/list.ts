import { atom, selector } from "recoil"
import { div, gt, minus } from "../../libs/math"
import { findPriceQuery } from "../contract/normalize"
import { protocolQuery } from "../contract/protocol"
import { PriceKey } from "../../hooks/contractKeys"
import { useStoreLoadable } from "../utils/loadable"
import { assetsHelpersQuery, findChangeQuery } from "./assets"
import { StatsNetwork } from "./statistic"

type FarmingType = "long" | "short"

export interface Item extends ListedItem {
  terraswap: { price: string; change?: string }
  oracle: { price: string; change?: string }
  premium?: string

  liquidity: string
  shortValue?: string
  volume: string
  apr: { long?: string; short?: string }

  recommended: FarmingType
}

export const getAssetItemQuery = selector({
  key: "getAssetItem",
  get: ({ get }) => {
    const findPrice = get(findPriceQuery)
    const findChange = get(findChangeQuery)
    const { volume, liquidity, shortValue, longAPR, shortAPR } = get(
      assetsHelpersQuery(StatsNetwork.TERRA)
    )

    return (item: ListedItem): Item => {
      const { token } = item
      const terraswap = findPrice(PriceKey.PAIR, token)
      const oracle = findPrice(PriceKey.ORACLE, token)
      const premium = oracle ? minus(div(terraswap, oracle), 1) : undefined
      const long = longAPR(token)
      const short = shortAPR(token)

      return {
        ...item,
        terraswap: {
          price: terraswap,
          change: findChange(PriceKey.PAIR)(token, terraswap),
        },
        oracle: {
          price: oracle,
          change: findChange(PriceKey.ORACLE)(token, oracle),
        },
        premium,
        volume: volume(token),
        liquidity: liquidity(token),
        shortValue: shortValue(token),
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
    return listed.map(getAssetItem).filter(({ liquidity }) => gt(liquidity, 0))
  },
})

/* state */
export const assetListState = atom<Item[]>({
  key: "assetListState",
  default: [],
})

export const useAssetList = () => {
  return useStoreLoadable(assetListState, assetListQuery)
}

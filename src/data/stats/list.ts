import { PriceKey } from "../../hooks/contractKeys"
import { div, gt, minus } from "../../libs/math"
import { useProtocol } from "../contract/protocol"
import { useAssetsHelpersByNetwork } from "./assets"

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

export const useTerraAssetList = () => {
  const { listed } = useProtocol()
  const helpers = useAssetsHelpersByNetwork()
  const { [PriceKey.PAIR]: getPair, [PriceKey.ORACLE]: getOracle } = helpers
  const { volume, liquidity, longAPR, shortAPR } = helpers

  return listed
    .map((item): Item => {
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
    })
    .filter(({ liquidity }) => !liquidity || gt(liquidity, 0))
}

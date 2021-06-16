import { atom, selector } from "recoil"
import { div, minus, sum, times } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { useStoreLoadable } from "../utils/loadable"
import { protocolQuery } from "../contract/protocol"
import { findPriceQuery } from "../contract/normalize"
import { limitOrdersQuery } from "../contract/orders"
import { TradeType } from "../../types/Types"

export const myLimitOrderQuery = selector({
  key: "myLimitOrder",

  get: ({ get }) => {
    const priceKey = PriceKey.PAIR

    const { whitelist, parseToken } = get(protocolQuery)
    const orders = get(limitOrdersQuery)
    const findPrice = get(findPriceQuery)

    const dataSource = orders.map((order) => {
      const { filled_offer_amount, filled_ask_amount } = order
      const { offer_asset, ask_asset } = order

      const offerToken = parseToken(offer_asset)
      const askToken = parseToken(ask_asset)

      const offerAsset = {
        ...offerToken,
        amount: minus(offerToken.amount, filled_offer_amount),
      }

      const askAsset = {
        ...askToken,
        amount: minus(askToken.amount, filled_ask_amount),
      }

      const type = offerAsset.token === "uusd" ? TradeType.BUY : TradeType.SELL

      const asset = {
        [TradeType.BUY]: askAsset,
        [TradeType.SELL]: offerAsset,
      }[type]
      const uusd = {
        [TradeType.BUY]: offerAsset,
        [TradeType.SELL]: askAsset,
      }[type]

      const limitPrice = {
        [TradeType.BUY]: div(offerToken.amount, askToken.amount),
        [TradeType.SELL]: div(askToken.amount, offerToken.amount),
      }[type]

      const terraswapPrice = {
        [TradeType.BUY]: findPrice(priceKey, askAsset.token),
        [TradeType.SELL]: findPrice(priceKey, offerAsset.token),
      }[type]

      const offerPrice = findPrice(priceKey, offerAsset.token)
      const offerValue = times(offerPrice, offerAsset.amount)

      const { status } = whitelist[asset.token]

      return {
        ...order,
        token: asset.token,
        status,
        type,
        asset,
        uusd,
        limitPrice,
        terraswapPrice,
        offerValue,
      }
    })

    const totalValue = sum(dataSource.map(({ offerValue }) => offerValue))

    return { totalValue, dataSource }
  },
})

const myLimitOrderState = atom({
  key: "myLimitOrderState",
  default: myLimitOrderQuery,
})

export const useMyLimitOrder = () => {
  return useStoreLoadable(myLimitOrderQuery, myLimitOrderState)
}

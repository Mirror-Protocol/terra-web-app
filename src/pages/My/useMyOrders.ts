import { useEffect, useState } from "react"
import { last } from "ramda"
import { UUSD } from "../../constants"
import useContractQuery from "../../graphql/useContractQuery"
import { useContractsAddress, useContract, useNetwork } from "../../hooks"
import { useCombineKeys, useWallet } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import { div, minus, sum, times } from "../../libs/math"
import { Type } from "../Trade"

const useMyOrders = () => {
  const priceKey = PriceKey.PAIR
  const keys = [priceKey]

  const { loading: loadingPrice } = useCombineKeys(keys)
  const { parseToken } = useContractsAddress()
  const { find } = useContract()
  const { result, orders, more } = useQueryOrders()
  const { loading: loadingOrders } = result
  const loading = loadingOrders || loadingPrice

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

    const type = offerAsset.token === UUSD ? Type.BUY : Type.SELL

    const asset = { [Type.BUY]: askAsset, [Type.SELL]: offerAsset }[type]
    const uusd = { [Type.BUY]: offerAsset, [Type.SELL]: askAsset }[type]

    const limitPrice = {
      [Type.BUY]: div(offerToken.amount, askToken.amount),
      [Type.SELL]: div(askToken.amount, offerToken.amount),
    }[type]

    const terraswapPrice = {
      [Type.BUY]: find(priceKey, askAsset.token),
      [Type.SELL]: find(priceKey, offerAsset.token),
    }[type]

    const offerPrice = find(priceKey, offerAsset.token)
    const offerValue = times(offerPrice, offerAsset.amount)

    return {
      ...order,
      type,
      asset,
      uusd,
      limitPrice,
      terraswapPrice,
      offerValue,
    }
  })

  const total = sum(dataSource.map(({ offerValue }) => offerValue))

  return { keys, loading, dataSource, total, more }
}

export default useMyOrders

/* query */
const LIMIT = 30
export const useQueryOrders = () => {
  const { limitOrder = "" } = useNetwork()
  const { address } = useWallet()

  const [orders, setOrders] = useState<Order[]>([])
  const [offset, setOffset] = useState<number>()
  const [done, setDone] = useState(true)

  const query = useContractQuery<{ orders: Order[] }>({
    contract: limitOrder,
    msg: {
      orders: { bidder_addr: address, limit: LIMIT, start_after: offset },
    },
  })

  const { parsed } = query

  useEffect(() => {
    if (parsed) {
      setOrders((prev) => [...prev, ...parsed.orders])
      setDone(parsed.orders.length < LIMIT)
    }

    // eslint-disable-next-line
  }, [JSON.stringify(parsed)])

  const more = done ? undefined : () => setOffset(last(orders)?.order_id)

  return { ...query, orders, more }
}

export const useQueryOrder = (id: number) => {
  const { limitOrder = "" } = useNetwork()

  return useContractQuery<Order>({
    contract: limitOrder,
    msg: { order: { order_id: id } },
  })
}

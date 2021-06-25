import { useRecoilValue } from "recoil"
import { plus, times } from "../libs/math"
import { format } from "../libs/parse"
import { useProtocol } from "../data/contract/protocol"
import { PriceKey } from "../hooks/contractKeys"
import { pairPoolQuery } from "../data/contract/contract"
import { parsePairPool, useFindPrice } from "../data/contract/normalize"
import Page from "../components/Page"
import Table from "../components/Table"
import Caption from "../components/Caption"

const Info = () => {
  const priceKey = PriceKey.PAIR
  const { listed } = useProtocol()
  const find = useFindPrice()
  const pairPool = useRecoilValue(pairPoolQuery)

  const dataSource = !pairPool
    ? []
    : listed.map((item) => {
        const { token } = item
        const price = find(priceKey, token)
        const { uusd, asset } = parsePairPool(pairPool[token])
        const total = plus(uusd, times(asset, price))

        return { ...item, price, uusd, asset, total }
      })

  return (
    <Page title="Info">
      <Table
        rowKey="token"
        caption={<Caption title="Pair Pool" />}
        columns={[
          { key: "symbol", title: "Ticker", bold: true },
          { key: "name", title: "Underlying Name" },
          {
            key: "uusd",
            title: "UST",
            render: (value) => format(value, "uusd", { integer: true }),
            align: "right",
          },
          {
            key: "asset",
            render: (value, { symbol }) =>
              format(value, symbol, { integer: true }),
            align: "right",
          },
          {
            key: "price",
            render: (value) => `${format(value)} UST`,
            align: "right",
          },
          {
            key: "total",
            render: (value) => format(value, "uusd", { integer: true }),
            align: "right",
          },
        ]}
        dataSource={dataSource}
      />
    </Page>
  )
}

export default Info

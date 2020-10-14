import React from "react"
import { isNil } from "ramda"
import { UST, UUSD } from "../../constants"
import { times, lt } from "../../libs/math"
import { insertIf } from "../../libs/utils"
import { format, formatAsset } from "../../libs/parse"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { AssetInfoKey, PriceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import useYesterday, { calcChange } from "../../statistics/useYesterday"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Change from "../../components/Change"
import styles from "./TopTrading.module.scss"

const TopTrading = () => {
  const priceKey = PriceKey.PAIR
  const infoKey = AssetInfoKey.LIQUIDITY

  const { listed } = useContractsAddress()
  const { find } = useContract()
  const { loading, data } = useRefetch([priceKey, infoKey])

  const { [priceKey]: yesterday } = useYesterday()
  const hideChange = Object.values(yesterday).every(isNil)

  const { volume } = useAssetStats()

  const dataSource = listed
    .map((item) => {
      const { symbol, token } = item
      const price = find(priceKey, symbol)

      return {
        ...item,
        price,
        liquidity: times(find(infoKey, symbol), find(priceKey, symbol)),
        change: calcChange({ today: price, yesterday: yesterday[token] }),
        volume: volume[token] ?? "0",
      }
    })
    .sort((a, b) => (lt(a.volume, b.volume) ? 1 : -1))

  return (
    <Card title="Top Trading Assets" loading={loading}>
      {!!data && (
        <Table
          columns={[
            {
              key: "rank",
              className: styles.rank,
              render: (_value, _record, index) => index + 1,
              align: "center",
            },
            {
              key: "symbol",
              title: "Ticker",
              bold: true,
            },
            {
              key: "name",
            },
            {
              key: "liquidity",
              render: (value) => formatAsset(value, UUSD, { integer: true }),
              align: "right",
            },
            {
              key: "volume",
              title: "Volume(24hrs)",
              render: (value) => formatAsset(value, UUSD, { integer: true }),
              align: "right",
            },
            {
              key: "price",
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
              narrow: !hideChange ? ["right"] : undefined,
            },
            ...insertIf(!hideChange, {
              key: "change",
              title: "",
              render: (change: string) => <Change>{change}</Change>,
              narrow: ["left"],
            }),
          ]}
          dataSource={dataSource}
        />
      )}
    </Card>
  )
}

export default TopTrading
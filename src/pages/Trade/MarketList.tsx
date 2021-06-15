import { useState } from "react"
import { useRecoilValueLoadable } from "recoil"

import { lt, gt, number } from "../../libs/math"
import { Item, useAssetList } from "../../data/stats/list"
import { StatsNetwork } from "../../data/stats/statistic"
import { assetsHistoryQuery } from "../../data/stats/assets"

import Table from "../../components/Table"
import Change from "../../components/Change"
import Formatted from "../../components/Formatted"
import Percent from "../../components/Percent"
import Search from "../../components/Search"
import AssetItem from "../../components/AssetItem"
import ChartContainer from "../../containers/ChartContainer"
import { MarketType } from "../../types/Types"

interface Sorter {
  label: string
  compare: (a: Item, b: Item) => number
}

const Sorters: Dictionary<Sorter> = {
  TOPTRADING: {
    label: "Top Trading",
    compare: (a, b) => (lt(a.volume ?? 0, b.volume ?? 0) ? 1 : -1),
  },
  TOPGAINER: {
    label: "Top Gainer",
    compare: (a, b) =>
      lt(a.terraswap.change ?? 0, b.terraswap.change ?? 0) ? 1 : -1,
  },
  TOPLOSER: {
    label: "Top Loser",
    compare: (a, b) =>
      lt(a.terraswap.change ?? 0, b.terraswap.change ?? 0) ? -1 : 1,
  },
}

const MarketList = () => {
  const list = useAssetList()
  const [input, setInput] = useState("")
  const [sorter, setSorter] = useState("TOPTRADING")
  const history = useRecoilValueLoadable(assetsHistoryQuery(StatsNetwork.TERRA))

  const dataSource = list
    .filter(({ name, symbol }) =>
      [name, symbol].some((l) => l.toLowerCase().includes(input.toLowerCase()))
    )
    .sort(Sorters[sorter].compare)

  return (
    <>
      <Search value={input} onChange={(e) => setInput(e.target.value)}>
        <select value={sorter} onChange={(e) => setSorter(e.target.value)}>
          {Object.entries(Sorters).map(([key, { label }]) => (
            <option value={key} key={key}>
              {label}
            </option>
          ))}
        </select>
      </Search>

      <Table
        rows={({ token }) => ({
          to: { hash: MarketType.BUY, state: { token } },
        })}
        columns={[
          {
            key: "token",
            title: "Ticker",
            render: (token) => <AssetItem token={token} />,
            width: "25%",
            bold: true,
          },
          {
            key: "terraswap",
            title: "Terraswap Price",
            render: ({ price }, { terraswap: { change } }) =>
              gt(price, 0) && [
                <Formatted unit="UST">{price}</Formatted>,
                <Change align="right">{change}</Change>,
              ],
            align: "right",
          },
          {
            key: "history",
            title: "24h Chart",
            render: (_, { token }) =>
              history.state === "hasValue" && (
                <ChartContainer
                  datasets={history.contents[token]?.map(
                    ({ timestamp, price }) => {
                      return { x: timestamp, y: number(price) }
                    }
                  )}
                  compact
                />
              ),
            align: "right",
            desktop: true,
          },
          {
            key: "premium",
            title: "Premium",
            render: (value) => <Percent>{value}</Percent>,
            align: "right",
            desktop: true,
          },
          {
            key: "volume",
            title: "Volume",
            render: (value) => <Formatted symbol="uusd">{value}</Formatted>,
            align: "right",
            width: "19%",
            desktop: true,
          },
        ]}
        dataSource={dataSource}
      />
    </>
  )
}

export default MarketList

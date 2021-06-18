import Tooltips from "../../lang/Tooltips"
import { lt, gt, number } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { useTerraAssetList } from "../../data/stats/list"
import { useAssetsHistory, useFindChanges } from "../../data/stats/assets"

import Table from "../../components/Table"
import Change from "../../components/Change"
import Formatted from "../../components/Formatted"
import Percent from "../../components/Percent"
import AssetItem from "../../components/AssetItem"
import { TooltipIcon } from "../../components/Tooltip"
import useListFilter, { Sorter } from "../../components/useListFilter"
import ChartContainer from "../../containers/ChartContainer"
import AssetsIdleTable from "../../containers/AssetsIdleTable"
import { MarketType } from "../../types/Types"

const Sorters: Dictionary<Sorter> = {
  TOPTRADING: {
    label: "Top Trading",
    compare: (a, b) => (lt(a.volume ?? 0, b.volume ?? 0) ? 1 : -1),
  },
  TOPGAINER: {
    label: "Top Gainer",
    compare: (a, b) =>
      lt(a.change?.[PriceKey.PAIR] ?? 0, b.change?.[PriceKey.PAIR] ?? 0)
        ? 1
        : -1,
  },
  TOPLOSER: {
    label: "Top Loser",
    compare: (a, b) =>
      lt(a.change?.[PriceKey.PAIR] ?? 0, b.change?.[PriceKey.PAIR] ?? 0)
        ? -1
        : 1,
  },
}

const MarketList = () => {
  const list = useTerraAssetList()
  const findChanges = useFindChanges()
  const history = useAssetsHistory()
  const { filter, compare, renderSearch } = useListFilter("TOPTRADING", Sorters)

  const dataSource = list
    .filter(({ name, symbol }) => [name, symbol].some(filter))
    .map((item) => ({ ...item, change: findChanges(item.token) }))
    .sort(compare)

  return (
    <>
      {renderSearch()}
      {!list.length ? (
        <AssetsIdleTable />
      ) : (
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
              key: PriceKey.PAIR,
              title: "Terraswap Price",
              render: (price, { change }) =>
                gt(price, 0) && [
                  <Formatted unit="UST">{price}</Formatted>,
                  <Change align="right">{change?.[PriceKey.PAIR]}</Change>,
                ],
              align: "right",
            },
            {
              key: "history",
              title: (
                <TooltipIcon content={Tooltips.Trade.Chart}>
                  24h Chart
                </TooltipIcon>
              ),
              render: (_, { token }) => (
                <ChartContainer
                  datasets={
                    history?.[token]?.map(({ timestamp, price }) => {
                      return { x: timestamp, y: number(price) }
                    }) ?? []
                  }
                  compact
                />
              ),
              align: "right",
              desktop: true,
            },
            {
              key: "premium",
              title: (
                <TooltipIcon content={Tooltips.Trade.Premium}>
                  Premium
                </TooltipIcon>
              ),
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
      )}
    </>
  )
}

export default MarketList

import { Link } from "react-router-dom"
import { UST, UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { lt, gt, div, minus } from "../../libs/math"
import { format, formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { AssetInfoKey, PriceKey } from "../../hooks/contractKeys"
import { StatsNetwork } from "../../statistics/useDashboard"
import useAssetStats from "../../statistics/useAssetStats"
import useYesterday, { calcChange } from "../../statistics/useYesterday"
import { getPath, MenuKey } from "../../routes"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Change from "../../components/Change"
import { TooltipIcon } from "../../components/Tooltip"
import { Type } from "../Trade"
import styles from "./TopTrading.module.scss"

const TopTrading = ({ network }: { network: StatsNetwork }) => {
  const infoKey = AssetInfoKey.LIQUIDITY
  const keys = [PriceKey.PAIR, PriceKey.ORACLE, infoKey]

  const { listed } = useContractsAddress()
  const { find } = useContract()
  const yesterday = useYesterday()
  const { volume, liquidity } = useAssetStats(network)
  const { loading, data } = useRefetch(keys)

  const dataSource = listed
    .filter(({ token }) => gt(liquidity[token] ?? 0, 0))
    .map((item) => {
      const { token } = item
      const pair = find(PriceKey.PAIR, token)
      const oracle = find(PriceKey.ORACLE, token)
      const premium = minus(div(pair, oracle), 1)

      return {
        ...item,
        pair: {
          price: pair,
          change: calcChange({
            today: pair,
            yesterday: yesterday[PriceKey.PAIR][token],
          }),
        },
        oracle: {
          price: oracle,
          change: calcChange({
            today: oracle,
            yesterday: yesterday[PriceKey.ORACLE][token],
          }),
        },
        premium,
        liquidity: liquidity[token] ?? "0",
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
              render: (symbol, { token }) => {
                const path = getPath(MenuKey.TRADE)
                const to = { pathname: path, hash: Type.BUY, state: { token } }

                return (
                  <Link className={styles.link} to={to}>
                    {symbol}
                  </Link>
                )
              },
              bold: true,
            },
            { key: "name", title: "Underlying Name" },
            {
              key: "volume",
              title: (
                <TooltipIcon content={Tooltip.TopTrading.Volume}>
                  Volume
                </TooltipIcon>
              ),
              render: (value) => formatAsset(value, UUSD, { integer: true }),
              align: "right",
            },
            {
              key: "liquidity",
              title: (
                <TooltipIcon content={Tooltip.TopTrading.Liquidity}>
                  Liquidity
                </TooltipIcon>
              ),
              render: (value) => formatAsset(value, UUSD, { integer: true }),
              align: "right",
            },
            {
              key: "oracle",
              title: (
                <TooltipIcon content={Tooltip.TopTrading.Oracle}>
                  Oracle Price
                </TooltipIcon>
              ),
              render: ({ price }) => gt(price, 0) && `${format(price)} ${UST}`,
              align: "right",
              narrow: ["right"],
            },
            {
              key: "pair",
              title: "Terraswap Price",
              render: ({ price }) => gt(price, 0) && `${format(price)} ${UST}`,
              align: "right",
              narrow: ["right"],
            },
            {
              key: "pair.change",
              dataIndex: "pair",
              title: "",
              render: ({ change }: { change: string }) => (
                <Change>{change}</Change>
              ),
              narrow: ["left"],
            },
            {
              key: "premium",
              dataIndex: "premium",
              title: "Spread",
              render: (value) => percent(value),
              align: "right",
            },
          ]}
          dataSource={dataSource}
        />
      )}
    </Card>
  )
}

export default TopTrading

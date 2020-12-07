import { UST, UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { times, lt, gt } from "../../libs/math"
import { format, formatAsset } from "../../libs/parse"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { AssetInfoKey, PriceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import useYesterday, { calcChange } from "../../statistics/useYesterday"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Change from "../../components/Change"
import { TooltipIcon } from "../../components/Tooltip"
import styles from "./TopTrading.module.scss"

const TopTrading = () => {
  const infoKey = AssetInfoKey.LIQUIDITY
  const keys = [PriceKey.PAIR, PriceKey.ORACLE, infoKey]

  const { listed } = useContractsAddress()
  const { find } = useContract()
  const yesterday = useYesterday()
  const { volume } = useAssetStats()
  const { loading, data } = useRefetch(keys)

  const dataSource = listed
    .map((item) => {
      const { token } = item
      const pair = find(PriceKey.PAIR, token)
      const oracle = find(PriceKey.ORACLE, token)
      const liquidity = find(infoKey, token)

      return {
        ...item,
        liquidity: times(liquidity, pair),
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
            { key: "symbol", title: "Ticker", bold: true },
            { key: "name", title: "Underlying Name" },
            {
              key: "volume",
              title: (
                <TooltipIcon content={Tooltip.TopTrading.Volume}>
                  Volume (24hrs)
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
              key: "oracle.change",
              dataIndex: "oracle",
              title: "",
              render: ({ change }: { change: string }) => (
                <Change>{change}</Change>
              ),
              narrow: ["left"],
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
          ]}
          dataSource={dataSource}
        />
      )}
    </Card>
  )
}

export default TopTrading

import Tooltip from "../../lang/Tooltip.json"
import { formatAsset } from "../../libs/parse"
import { useMyShortFarming } from "../../data/my/short"

import Table from "../../components/Table"
import Caption from "../../components/Caption"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import Formatted from "../../components/Formatted"
import Percent from "../../components/Percent"
import CaptionData from "./CaptionData"

const ShortFarming = () => {
  const { dataSource, totalRewards, totalRewardsValue } = useMyShortFarming()

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <CaptionData
      list={[
        {
          title: "Total Reward",
          content: formatAsset(totalRewards, "MIR"),
        },
        {
          title: "Total Reward Value",
          content: formatAsset(totalRewardsValue, "uusd"),
        },
      ]}
    />
  )

  return !dataExists ? null : (
    <Table
      caption={<Caption title="Short Farming" description={description} />}
      columns={[
        {
          key: "symbol",
          title: [
            "Ticker",
            <TooltipIcon content={Tooltip.My.APR}>APR</TooltipIcon>,
          ],
          render: (symbol, { status, apr }) => [
            <>
              {status === "DELISTED" && <Delisted />}
              {symbol}
            </>,
            <Percent>{apr}</Percent>,
          ],
          bold: true,
        },
        {
          key: "shorted",
          title: "Shorted",
          render: (value, { symbol }) => (
            <Formatted symbol={symbol}>{value}</Formatted>
          ),
          align: "right",
        },
        {
          key: "reward",
          title: (
            <TooltipIcon content={Tooltip.My.FarmReward}>Reward</TooltipIcon>
          ),
          render: (value) => <Formatted symbol="MIR">{value}</Formatted>,
          align: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default ShortFarming

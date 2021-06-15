import { format as formatDate } from "date-fns"
import { FMT } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { gt } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { useMyShortFarming } from "../../data/my/short"

import Table from "../../components/Table"
import Caption, { CaptionAction } from "../../components/Caption"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import Formatted from "../../components/Formatted"
import Percent from "../../components/Percent"
import { getPath, MenuKey } from "../../routes"
import CaptionData from "./CaptionData"

const ShortFarming = () => {
  const { totalRewards, totalRewardsValue, ...rest } = useMyShortFarming()
  const { dataSource, totalLockedUST, totalUnlockedUST } = rest

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <>
      <CaptionData
        list={[
          {
            title: "Reward",
            content: (
              <>
                {formatAsset(totalRewards, "MIR")} (≈{" "}
                {formatAsset(totalRewardsValue, "uusd")})
              </>
            ),
          },
        ]}
      />
      <CaptionData
        list={[
          {
            title: "Locked UST",
            content: formatAsset(totalLockedUST, "uusd"),
          },
          {
            title: "Unlocked UST",
            content: formatAsset(totalUnlockedUST, "uusd"),
          },
          {
            title: "",
            content: (
              <CaptionAction to={getPath(MenuKey.CLAIMUST)}>
                Claim UST
              </CaptionAction>
            ),
          },
        ]}
      />
    </>
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
          key: "locked",
          title: ["Locked UST", "Last Unlock Time"],
          render: (amount, { unlock_time }) => {
            const formatted = <Formatted symbol="uusd">{amount}</Formatted>
            return gt(amount, 0)
              ? [formatted, formatDate(new Date(unlock_time * 1000), FMT.HHmm)]
              : formatted
          },
          align: "right",
        },
        {
          key: "unlocked",
          title: "Unlocked UST",
          render: (amount) => <Formatted symbol="uusd">{amount}</Formatted>,
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

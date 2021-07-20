import Tooltips from "../../lang/Tooltips"
import { gt } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { secondsToDate } from "../../libs/date"
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
    <CaptionData
      list={[
        {
          title: "Reward",
          content: (
            <>
              {formatAsset(totalRewards, "MIR")}{" "}
              <span className="muted">
                ≈ {formatAsset(totalRewardsValue, "uusd")}
              </span>
            </>
          ),
        },
        {
          title: (
            <TooltipIcon content={Tooltips.My.TotalLockedUST}>
              Locked
            </TooltipIcon>
          ),
          content: formatAsset(totalLockedUST, "uusd"),
        },
        {
          title: (
            <TooltipIcon content={Tooltips.My.TotalUnlockedUST}>
              Unlocked
            </TooltipIcon>
          ),
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
  )

  return !dataExists ? null : (
    <Table
      caption={<Caption title="Short Farming" description={description} />}
      rowKey="token"
      columns={[
        {
          key: "symbol",
          title: [
            "Ticker",
            <TooltipIcon content={Tooltips.My.APR}>APR</TooltipIcon>,
          ],
          render: (symbol, { delisted, apr }) => [
            <>
              {delisted && <Delisted />}
              {symbol}
            </>,
            apr && <Percent>{apr}</Percent>,
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
          title: [
            <TooltipIcon content={Tooltips.My.LockedUST}>
              Locked UST
            </TooltipIcon>,
            "Last Unlock Time",
          ],
          render: (amount, { unlock_time }) => {
            const formatted = <Formatted symbol="uusd">{amount}</Formatted>
            return gt(amount, 0)
              ? [formatted, secondsToDate(unlock_time)]
              : formatted
          },
          align: "right",
        },
        {
          key: "unlocked",
          title: (
            <TooltipIcon content={Tooltips.My.UnlockedUST}>
              Unlocked UST
            </TooltipIcon>
          ),
          render: (amount) => <Formatted symbol="uusd">{amount}</Formatted>,
          align: "right",
        },
        {
          key: "reward",
          title: (
            <TooltipIcon content={Tooltips.My.FarmReward}>Reward</TooltipIcon>
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

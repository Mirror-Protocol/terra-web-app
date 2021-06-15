import Tooltip from "../../lang/Tooltip.json"
import { formatAsset } from "../../libs/parse"
import getLpName from "../../libs/getLpName"
import { useProtocol } from "../../data/contract/protocol"
import { useMyFarming } from "../../data/my/farming"
import { getPath, MenuKey } from "../../routes"

import Table from "../../components/Table"
import Caption from "../../components/Caption"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import Percent from "../../components/Percent"
import { StakeType } from "../../types/Types"
import CaptionData from "./CaptionData"

const Farming = () => {
  const { dataSource, totalRewards, totalRewardsValue } = useMyFarming()
  const { getSymbol } = useProtocol()

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
      caption={
        <Caption
          title={
            <TooltipIcon content={Tooltip.My.Farming}>Farming</TooltipIcon>
          }
          description={description}
        />
      }
      columns={[
        {
          key: "symbol",
          title: [
            "Pool Name",
            <TooltipIcon content={Tooltip.My.APR}>APR</TooltipIcon>,
          ],
          render: (symbol, { status, apr }) => [
            <>
              {status === "DELISTED" && <Delisted />}
              {getLpName(symbol)}
            </>,
            <Percent>{apr}</Percent>,
          ],
          bold: true,
        },
        {
          key: "withdrawable",
          title: (
            <TooltipIcon content={Tooltip.My.Withdrawable}>
              Withdrawable Asset
            </TooltipIcon>
          ),
          render: (withdrawable) =>
            withdrawable && [
              <>
                <Formatted symbol={getSymbol(withdrawable.asset.token)}>
                  {withdrawable.asset.amount}
                </Formatted>{" "}
                +{" "}
                <Formatted symbol="uusd">{withdrawable.uusd.amount}</Formatted>
              </>,
              <Formatted symbol="uusd">{withdrawable.value}</Formatted>,
            ],
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
        {
          key: "actions",
          dataIndex: "token",
          render: (token) => (
            <LinkButton
              to={{
                pathname: getPath(MenuKey.UNSTAKE),
                hash: StakeType.UNSTAKE,
                state: { token },
              }}
              size="xs"
              outline
            >
              {MenuKey.UNSTAKE}
            </LinkButton>
          ),
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default Farming

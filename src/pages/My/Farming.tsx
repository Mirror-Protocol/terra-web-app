import Tooltips from "../../lang/Tooltips"
import { formatAsset } from "../../libs/parse"
import { capitalize } from "../../libs/utils"
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
  const { getSymbol } = useProtocol()
  const { dataSource, totalRewards, totalRewardsValue } = useMyFarming()

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
      ]}
    />
  )

  return !dataExists ? null : (
    <Table
      caption={
        <Caption
          title={
            <TooltipIcon content={Tooltips.My.Farming}>Farming</TooltipIcon>
          }
          description={description}
        />
      }
      rowKey="token"
      columns={[
        {
          key: "symbol",
          title: [
            "Pool Name",
            <TooltipIcon content={Tooltips.My.APR}>APR</TooltipIcon>,
          ],
          render: (symbol, { delisted, apr }) => [
            <>
              {delisted && <Delisted />}
              {getLpName(symbol)}
            </>,
            apr && <Percent>{apr}</Percent>,
          ],
          bold: true,
        },
        {
          key: "withdrawable",
          title: (
            <TooltipIcon content={Tooltips.My.Withdrawable}>
              Withdrawable
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
            <TooltipIcon content={Tooltips.My.FarmReward}>Reward</TooltipIcon>
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
                pathname: getPath(MenuKey.STAKE),
                hash: StakeType.UNSTAKE,
                state: { token },
              }}
              size="xs"
              outline
            >
              {capitalize(StakeType.UNSTAKE)}
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

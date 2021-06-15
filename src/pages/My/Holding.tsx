import Tooltip from "../../lang/Tooltip.json"
import { formatAsset } from "../../libs/parse"
import { useMyHolding } from "../../data/my/holding"
import { useProtocol } from "../../data/contract/protocol"
import { getPath, MenuKey } from "../../routes"

import { TradeType } from "../../types/Types"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Change from "../../components/Change"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import CaptionData from "./CaptionData"

const Holding = () => {
  const { totalValue, dataSource } = useMyHolding()
  const { getIsDelisted } = useProtocol()

  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>{formatAsset(value, "uusd")}</TooltipIcon>
  )

  const dataExists = !!dataSource.length

  const description = dataExists && (
    <CaptionData
      list={[
        {
          title: "Holding Value",
          content: renderTooltip(totalValue, Tooltip.My.TotalHoldingValue),
        },
      ]}
    />
  )

  return !dataExists ? null : (
    <Table
      caption={
        <Caption
          title={
            <TooltipIcon content={Tooltip.My.Holding}>Holding</TooltipIcon>
          }
          description={description}
        />
      }
      columns={[
        {
          key: "symbol",
          title: "Ticker",
          render: (symbol, { status, name }) => [
            <>
              {status === "DELISTED" && <Delisted />}
              <h1>{symbol}</h1>
            </>,
            name,
          ],
          bold: true,
        },
        {
          key: "price",
          title: "Terraswap Price",
          render: (value, { change }) => [
            <Formatted unit="UST">{value}</Formatted>,
            <Change inline>{change}</Change>,
          ],
          align: "right",
        },
        {
          key: "balance",
          title: (
            <TooltipIcon content={Tooltip.My.Balance}>Balance</TooltipIcon>
          ),
          render: (value, { symbol }) => (
            <Formatted symbol={symbol} noUnit>
              {value}
            </Formatted>
          ),
          align: "right",
        },
        {
          key: "value",
          title: <TooltipIcon content={Tooltip.My.Value}>Value</TooltipIcon>,
          render: (value) => <Formatted symbol="uusd">{value}</Formatted>,
          align: "right",
        },
        {
          key: "actions",
          dataIndex: "token",
          render: (token) => {
            const link = getIsDelisted(token)
              ? {
                  to: `/burn/${token}`,
                  children: MenuKey.BURN,
                }
              : {
                  to: {
                    pathname: getPath(MenuKey.TRADE),
                    state: { token },
                    hash: TradeType.BUY,
                  },
                  children: MenuKey.TRADE,
                }

            return <LinkButton {...link} size="xs" outline />
          },
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default Holding

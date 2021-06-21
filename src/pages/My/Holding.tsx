import Tooltips from "../../lang/Tooltips"
import { formatAsset } from "../../libs/parse"
import { useMyHolding } from "../../data/my/holding"
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

  const dataExists = !!dataSource.length

  const description = dataExists && (
    <CaptionData
      list={[
        {
          content: (
            <TooltipIcon content={Tooltips.My.TotalHoldingValue}>
              ≈ {formatAsset(totalValue, "uusd")}
            </TooltipIcon>
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
            <TooltipIcon content={Tooltips.My.Holding}>Holding</TooltipIcon>
          }
          description={description}
        />
      }
      columns={[
        {
          key: "symbol",
          title: "Ticker",
          render: (symbol, { delisted, name }) => [
            <>
              {delisted && <Delisted />}
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
            <TooltipIcon content={Tooltips.My.Balance}>Balance</TooltipIcon>
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
          title: <TooltipIcon content={Tooltips.My.Value}>Value</TooltipIcon>,
          render: (value) => <Formatted symbol="uusd">{value}</Formatted>,
          align: "right",
        },
        {
          key: "actions",
          dataIndex: "token",
          render: (token, { delisted }) => {
            const link = delisted
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

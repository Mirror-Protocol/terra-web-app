import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { UST, UUSD } from "../../constants"
import { div } from "../../libs/math"
import { format, formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import { getPath, MenuKey } from "../../routes"
import Card from "../../components/Card"
import Table from "../../components/Table"
import { Di } from "../../components/Dl"
import Change from "../../components/Change"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import { Type } from "../Trade"
import NoAssets from "./NoAssets"

interface Data extends ListedItem {
  balance: string
  price: string
  value: string
  change?: string
}

interface Props {
  loading: boolean
  totalValue: string
  dataSource: Data[]
}

const Holdings = ({ loading, totalValue, dataSource }: Props) => {
  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>{formatAsset(value, UUSD)}</TooltipIcon>
  )

  const dataExists = !!dataSource.length

  const description = dataExists && (
    <Di
      title="Total Holding Value"
      content={renderTooltip(totalValue, Tooltip.My.TotalHoldingValue)}
    />
  )

  return (
    <Card
      title={<TooltipIcon content={Tooltip.My.Holdings}>Holdings</TooltipIcon>}
      description={description}
      loading={loading}
    >
      {dataExists ? (
        <Table
          columns={[
            {
              key: "symbol",
              title: "Ticker",
              render: (symbol, { status }) => (
                <>
                  {status === "DELISTED" && <Delisted />}
                  {symbol}
                </>
              ),
              bold: true,
            },
            { key: "name", title: "Underlying Name" },
            {
              key: "price",
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
              narrow: ["right"],
            },
            {
              key: "change",
              title: "",
              render: (change: string) => <Change>{change}</Change>,
              narrow: ["left"],
            },
            {
              key: "balance",
              title: (
                <TooltipIcon content={Tooltip.My.Balance}>Balance</TooltipIcon>
              ),
              render: (value, { symbol }) => format(value, symbol),
              align: "right",
            },
            {
              key: "value",
              title: (
                <TooltipIcon content={Tooltip.My.Value}>Value</TooltipIcon>
              ),
              render: (value) => formatAsset(value, UUSD),
              align: "right",
            },
            {
              key: "ratio",
              dataIndex: "value",
              title: (
                <TooltipIcon content={Tooltip.My.PortfolioRatio}>
                  Port. Ratio
                </TooltipIcon>
              ),
              render: (value) => percent(div(value, totalValue)),
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "token",
              render: (token) => {
                const to = {
                  pathname: getPath(MenuKey.TRADE),
                  state: { token },
                }

                const list = [
                  { to: { ...to, hash: Type.BUY }, children: Type.BUY },
                  { to: { ...to, hash: Type.SELL }, children: Type.SELL },
                  {
                    to: { ...to, pathname: getPath(MenuKey.SEND) },
                    children: MenuKey.SEND,
                  },
                ]

                return <DashboardActions list={list} />
              },
              align: "right",
              fixed: "right",
            },
          ]}
          dataSource={dataSource}
        />
      ) : (
        !loading && (
          <NoAssets
            description={MESSAGE.MyPage.Empty.Holdings}
            link={MenuKey.TRADE}
          />
        )
      )}
    </Card>
  )
}

export default Holdings

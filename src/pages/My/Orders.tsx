import { UST, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { format, formatAsset } from "../../libs/parse"
import { capitalize } from "../../libs/utils"
import { getPath, MenuKey } from "../../routes"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Dl from "../../components/Dl"
import Button from "../../components/Button"
import { TooltipIcon } from "../../components/Tooltip"
import DashboardActions from "../../components/DashboardActions"
import NoAssets from "./NoAssets"

interface OrderDetails extends Order {
  type: string
  asset: Asset
  uusd: Asset
  limitPrice: string
  terraswapPrice: string
}

interface Props {
  loading: boolean
  total: string
  dataSource: OrderDetails[]
  more?: () => void
}

const Orders = ({ loading, dataSource, total, more }: Props) => {
  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>{value}</TooltipIcon>
  )

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <Dl
      list={[
        {
          title: renderTooltip(
            "Total Locked Value",
            Tooltip.My.TotalLockedValue
          ),
          content: formatAsset(total, UUSD),
        },
      ]}
    />
  )

  return (
    <Card
      title={renderTooltip("Limit Orders", Tooltip.My.LimitOrders)}
      description={description}
      loading={loading}
    >
      {dataExists ? (
        <Table
          columns={[
            {
              key: "order_id",
              title: "ID",
              bold: true,
              align: "center",
            },
            {
              key: "type",
              title: "Order Type",
              render: capitalize,
              align: "center",
            },
            {
              key: "terraswapPrice",
              title: "Terraswap Price",
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
            },
            {
              key: "limitPrice",
              title: renderTooltip("Limit Price", Tooltip.My.LimitPrice),
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
            },
            {
              key: "asset",
              title: "Order Amount",
              render: ({ amount, symbol }) => formatAsset(amount, symbol),
              align: "right",
            },
            {
              key: "uusd",
              title: renderTooltip("Order Value", Tooltip.My.OrderValue),
              render: ({ amount, symbol }) => formatAsset(amount, symbol),
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "order_id",
              render: (id) => (
                <DashboardActions
                  list={[
                    {
                      to: [getPath(MenuKey.LIMIT), id].join("/"),
                      children: "Cancel",
                    },
                  ]}
                />
              ),
              align: "right",
              fixed: "right",
            },
          ]}
          dataSource={dataSource}
        />
      ) : (
        !loading && (
          <NoAssets
            description={MESSAGE.MyPage.Empty.Orders}
            link={MenuKey.TRADE}
          />
        )
      )}

      {more && (
        <Button onClick={more} block outline submit>
          More
        </Button>
      )}
    </Card>
  )
}

export default Orders

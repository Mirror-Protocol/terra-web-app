import Tooltips from "../../lang/Tooltips"
import { formatAsset } from "../../libs/parse"
import { capitalize } from "../../libs/utils"
import { useMyLimitOrder } from "../../data/my/limit"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import CaptionData from "./CaptionData"

const LimitOrder = () => {
  const { dataSource, totalValue } = useMyLimitOrder()

  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>{value}</TooltipIcon>
  )

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <CaptionData
      list={[
        {
          title: "Locked",
          content: renderTooltip(
            formatAsset(totalValue, "uusd"),
            Tooltips.My.TotalLockedValue
          ),
        },
      ]}
    />
  )

  return !dataExists ? null : (
    <>
      <Table
        caption={
          <Caption
            title={renderTooltip("Limit Order", Tooltips.My.LimitOrder)}
            description={description}
          />
        }
        rowKey="order_id"
        columns={[
          {
            key: "type",
            title: ["Order Type", "ID"],
            render: (value, { delisted, order_id }) => [
              <>
                {delisted && <Delisted />}
                <h1>{capitalize(value)}</h1>
              </>,
              order_id,
            ],
            align: "left",
          },
          {
            key: "terraswapPrice",
            title: "Terraswap Price",
            render: (value) => <Formatted unit="UST">{value}</Formatted>,
            align: "right",
          },
          {
            key: "limitPrice",
            title: renderTooltip("Limit Price", Tooltips.My.LimitPrice),
            render: (value) => <Formatted unit="UST">{value}</Formatted>,
            align: "right",
          },
          {
            key: "asset",
            title: "Order Amount",
            render: (asset, { uusd }) => [
              <Formatted symbol={asset.symbol}>{asset.amount}</Formatted>,
              <Formatted symbol={uusd.symbol}>{uusd.amount}</Formatted>,
            ],
            align: "right",
          },
          {
            key: "actions",
            dataIndex: "order_id",
            render: (id) => (
              <LinkButton
                to={[getPath(MenuKey.LIMIT), id].join("/")}
                size="xs"
                outline
              >
                Cancel
              </LinkButton>
            ),
            align: "right",
            fixed: "right",
          },
        ]}
        dataSource={dataSource}
      />
    </>
  )
}

export default LimitOrder

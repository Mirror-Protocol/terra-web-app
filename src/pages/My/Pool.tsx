import { LP, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { formatAsset } from "../../libs/parse"
import getLpName from "../../libs/getLpName"
import { getPath, MenuKey } from "../../routes"

import Card from "../../components/Card"
import Table from "../../components/Table"
import { Di } from "../../components/Dl"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"

import { Type } from "../Pool"
import { Type as StakeType } from "../Stake"
import NoAssets from "./NoAssets"

interface Data extends ListedItem {
  balance: string
  withdrawable: { value: string; text: string }
  share: string
}

interface Props {
  loading: boolean
  totalWithdrawableValue: string
  dataSource: Data[]
}

const Pool = ({ loading, totalWithdrawableValue, dataSource }: Props) => {
  const dataExists = !!dataSource.length
  const description = dataExists && (
    <Di
      title="Total Withdrawable Value"
      content={
        <TooltipIcon content={Tooltip.My.TotalWithdrawableValue}>
          {formatAsset(totalWithdrawableValue, UUSD)}
        </TooltipIcon>
      }
    />
  )

  return (
    <Card
      title={<TooltipIcon content={Tooltip.My.Pool}>Pool</TooltipIcon>}
      description={description}
      loading={loading}
    >
      {dataExists ? (
        <Table
          columns={[
            {
              key: "symbol",
              title: "Pool Name",
              render: (symbol, { status }) => (
                <>
                  {status === "DELISTED" && <Delisted />}
                  {getLpName(symbol)}
                </>
              ),
              bold: true,
            },
            {
              key: "balance",
              title: (
                <TooltipIcon content={Tooltip.My.LP}>LP Balance</TooltipIcon>
              ),
              render: (value) => formatAsset(value, LP),
              align: "right",
            },
            {
              key: "withdrawable.text",
              title: (
                <TooltipIcon content={Tooltip.My.Withdrawable}>
                  Withdrawable Asset
                </TooltipIcon>
              ),
              align: "right",
            },
            {
              key: "withdrawable.value",
              title: "Withdrawable Value",
              render: (value) => formatAsset(value, UUSD),
              align: "right",
            },
            {
              key: "share",
              title: (
                <TooltipIcon content={Tooltip.My.PoolShare}>
                  Pool share
                </TooltipIcon>
              ),
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "token",
              render: (token) => {
                const to = {
                  pathname: getPath(MenuKey.POOL),
                  state: { token },
                }

                const stake = `${getPath(MenuKey.STAKE)}/${token}`

                const list = [
                  {
                    to: { ...to, hash: Type.PROVIDE },
                    children: Type.PROVIDE,
                  },
                  {
                    to: { ...to, hash: Type.WITHDRAW },
                    children: Type.WITHDRAW,
                  },
                  {
                    to: stake,
                    children: StakeType.STAKE,
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
            description={MESSAGE.MyPage.Empty.Pool}
            link={MenuKey.POOL}
          />
        )
      )}
    </Card>
  )
}

export default Pool

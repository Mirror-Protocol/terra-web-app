import React from "react"
import { LP, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { plus, times, sum, gt } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import { getPath, MenuKey } from "../../routes"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"
import Card from "../../components/Card"
import Table from "../../components/Table"
import { Di } from "../../components/Dl"
import usePool from "../../forms/usePool"
import usePoolShare from "../../forms/usePoolShare"
import { TooltipIcon } from "../../components/Tooltip"
import { Type } from "../Pool"
import { Type as StakeType } from "../Stake"
import getLpName from "../Stake/getLpName"
import NoAssets from "./NoAssets"
import DashboardActions from "./DashboardActions"

const Pool = () => {
  const priceKey = PriceKey.PAIR
  const keys = [
    priceKey,
    BalanceKey.TOKEN,
    BalanceKey.LPTOTAL,
    BalanceKey.LPSTAKED,
  ]

  const { data } = useRefetch(keys)

  /* context */
  const { listed } = useContractsAddress()
  const { result, find } = useContract()
  const getPool = usePool()
  const getPoolShare = usePoolShare()
  const loading = keys.some((key) => result[key].loading)

  /* table */
  const dataSource = !data
    ? []
    : listed
        .filter(({ symbol }) => gt(find(BalanceKey.LPTOTAL, symbol), 0))
        .map((item) => {
          const { symbol } = item

          return {
            ...item,
            balance: find(BalanceKey.LPTOTAL, symbol),
            stakable: find(BalanceKey.LPSTAKABLE, symbol),
          }
        })

  /* render */
  const dataExists = !!dataSource.length

  const getAssetValue = (asset: Asset) => {
    const price = find(priceKey, asset.symbol)
    return times(asset.amount, price)
  }

  const totalWithdrawable = sum(
    dataSource.map(({ balance, symbol }) => {
      const { fromLP } = getPool({ amount: balance, symbol })
      const assetValue = fromLP && getAssetValue(fromLP.asset)
      return plus(fromLP?.uusd.amount, assetValue)
    })
  )

  const description = dataExists && (
    <Di
      title="Total Withdrawble Value"
      content={
        <TooltipIcon content={Tooltip.My.TotalWithdrawableValue}>
          {formatAsset(totalWithdrawable, UUSD)}
        </TooltipIcon>
      }
    />
  )

  return (
    <Card title="Pool" description={description} loading={loading}>
      {dataExists ? (
        <Table
          columns={[
            {
              key: "symbol",
              title: "Pool Name",
              render: getLpName,
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
              key: "withdrawable",
              title: (
                <TooltipIcon content={Tooltip.My.Withdrawable}>
                  Withdrawable Asset
                </TooltipIcon>
              ),
              dataIndex: "balance",
              render: (amount, { symbol }) => {
                const { text } = getPool({ amount, symbol })
                return text.fromLP
              },
              align: "right",
            },
            {
              key: "share",
              title: (
                <TooltipIcon content={Tooltip.My.PoolShare}>
                  Pool share
                </TooltipIcon>
              ),
              dataIndex: "balance",
              render: (amount, { symbol }) => {
                const poolShare = getPoolShare({ amount, symbol })
                const { ratio, lessThanMinimum, minimum } = poolShare
                const prefix = lessThanMinimum ? "<" : ""
                return prefix + percent(lessThanMinimum ? minimum : ratio)
              },
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "symbol",
              render: (symbol) => {
                const to = {
                  pathname: getPath(MenuKey.POOL),
                  state: { symbol },
                }

                const stake = `${getPath(MenuKey.STAKE)}/${symbol}`

                const list = [
                  {
                    to: { ...to, hash: Type.PROVIDE },
                    children: Type.PROVIDE,
                    disabled: !gt(find(BalanceKey.TOKEN, symbol), 0),
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

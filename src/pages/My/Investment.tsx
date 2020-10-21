import React from "react"
import { isNil } from "ramda"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { UST, UUSD } from "../../constants"
import { div, gt, sum, times } from "../../libs/math"
import { format, formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import { getPath, MenuKey } from "../../routes"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { PriceKey, BalanceKey } from "../../hooks/contractKeys"
import useYesterday, { calcChange } from "../../statistics/useYesterday"
import Card from "../../components/Card"
import Table from "../../components/Table"
import { Di } from "../../components/Dl"
import Change from "../../components/Change"
import { TooltipIcon } from "../../components/Tooltip"
import { Type } from "../Trade"
import NoAssets from "./NoAssets"
import DashboardActions from "./DashboardActions"

const Investment = () => {
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.TOKEN
  const keys = [priceKey, balanceKey]
  const { data } = useRefetch(keys)

  /* context */
  const { listed } = useContractsAddress()
  const { result, find } = useContract()
  const { [priceKey]: yesterday } = useYesterday()
  const loading = keys.some((key) => result[key].loading)
  const hideChange = Object.values(yesterday).every(isNil)

  /* table */
  const dataSource = !data
    ? []
    : listed
        .map((item) => {
          const { token } = item
          const balance = find(balanceKey, item.symbol)
          const price = find(priceKey, item.symbol)
          const value = times(balance, price)
          const change = calcChange({
            today: price,
            yesterday: yesterday[token],
          })

          return { ...item, balance, price, value, change }
        })
        .filter(({ balance }) => gt(balance, 0))

  /* render */
  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>{formatAsset(value, UUSD)}</TooltipIcon>
  )

  const dataExists = !!dataSource.length

  const totalValue = sum(dataSource.map(({ value }) => value))
  const description = dataExists && (
    <Di
      title="Total Value"
      content={renderTooltip(totalValue, Tooltip.My.TotalValue)}
    />
  )

  return (
    <Card title="Investment" description={description} loading={loading}>
      {dataExists ? (
        <Table
          columns={[
            { key: "symbol", title: "Ticker", bold: true },
            { key: "name" },
            {
              key: "price",
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
              narrow: !hideChange ? ["right"] : undefined,
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
              dataIndex: "symbol",
              render: (symbol) => {
                const to = {
                  pathname: getPath(MenuKey.TRADE),
                  state: { symbol },
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
            description={MESSAGE.MyPage.Empty.Invested}
            link={MenuKey.TRADE}
          />
        )
      )}
    </Card>
  )
}

export default Investment

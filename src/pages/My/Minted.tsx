import React from "react"
import { isNil } from "ramda"
import classNames from "classnames"
import MESSAGE from "../../lang/MESSAGE.json"
import { UST, UUSD } from "../../constants"
import { lt, lte, minus, sum, times } from "../../libs/math"
import { insertIf } from "../../libs/utils"
import { format, formatAsset, lookupSymbol } from "../../libs/parse"
import { percent } from "../../libs/num"
import calc from "../../helpers/calc"
import { getPath, MenuKey } from "../../routes"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { PriceKey, AssetInfoKey } from "../../hooks/contractKeys"
import { AccountInfoKey } from "../../hooks/contractKeys"
import useYesterday, { calcChange } from "../../statistics/useYesterday"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Dl from "../../components/Dl"
import Icon from "../../components/Icon"
import Change from "../../components/Change"
import Tooltip from "../../components/Tooltip"
import { Type } from "../Mint"
import NoAssets from "./NoAssets"
import DashboardActions from "./DashboardActions"
import styles from "./Minted.module.scss"

const WARNING = 0.3
const DANGER = 0

const Minted = () => {
  const priceKey = PriceKey.ORACLE
  const keys = [
    priceKey,
    AccountInfoKey.MINTPOSITIONS,
    AssetInfoKey.MINCOLLATERALRATIO,
  ]

  const { data } = useRefetch(keys)
  const { [priceKey]: yesterday } = useYesterday()
  const hideChange = Object.values(yesterday).every(isNil)

  /* context */
  const { getListedItem, parseToken } = useContractsAddress()
  const { result, find, ...contract } = useContract()
  const { [AccountInfoKey.MINTPOSITIONS]: positions } = contract
  const loading = keys.some((key) => result[key].loading)

  /* table */
  const dataSource =
    !data || !positions
      ? []
      : positions.map((position) => {
          /* collateral */
          const collateral = parseToken(position.collateral)
          const collateralPrice = find(priceKey, collateral.symbol)
          const collateralValue = times(collateral.amount, collateralPrice)
          const { token: collateralToken } = getListedItem(collateral.symbol)
          const collateralChange = calcChange({
            today: collateralPrice,
            yesterday: yesterday[collateralToken],
          })

          /* asset */
          const asset = parseToken(position.asset)
          const assetPrice = find(priceKey, asset.symbol)
          const assetValue = times(asset.amount, assetPrice)
          const { token: assetToken } = getListedItem(asset.symbol)
          const assetChange = calcChange({
            today: assetPrice,
            yesterday: yesterday[assetToken],
          })

          /* ratio */
          const minRatio = find(AssetInfoKey.MINCOLLATERALRATIO, asset.symbol)

          const { ratio } = calc.mint({
            collateral: { ...collateral, price: collateralPrice },
            asset: { ...asset, price: assetPrice },
          })

          const danger = lt(minus(ratio, minRatio), DANGER)
          const warning = !danger && lte(minus(ratio, minRatio), WARNING)

          return {
            ...position,
            collateral: {
              ...collateral,
              price: collateralPrice,
              value: collateralValue,
              change: collateralChange,
            },
            asset: {
              ...asset,
              price: assetPrice,
              value: assetValue,
              change: assetChange,
            },
            ratio,
            minRatio,
            danger,
            warning,
          }
        })

  /* render */
  const renderTooltip = (value: string, tooltip: string) => (
    <Tooltip content={tooltip} icon>
      <>{`${format(value, UUSD)} ${UST}`}</>
    </Tooltip>
  )

  const dataExists = !!dataSource.length

  const totalCollateralValue = sum(
    dataSource.map(({ collateral }) => collateral.value)
  )

  const totalAssetValue = sum(dataSource.map(({ asset }) => asset.value))

  const description = dataExists && (
    <Dl
      list={[
        {
          title: "Total Minted Asset Value",
          content: renderTooltip(
            totalAssetValue,
            MESSAGE.MyPage.Tooltip.TotalMintedValue
          ),
        },
        {
          title: "Total Collateral Value",
          content: renderTooltip(
            totalCollateralValue,
            MESSAGE.MyPage.Tooltip.TotalCollateralValue
          ),
        },
      ]}
    />
  )

  return (
    <Card title="Minted" description={description} loading={loading}>
      {dataExists ? (
        <Table
          rows={({ warning, danger }) => ({
            background: warning || danger ? "red" : undefined,
          })}
          columns={[
            {
              key: "idx",
              render: (idx, { warning, danger }) => (
                <span
                  className={classNames(styles.idx, { red: warning || danger })}
                >
                  {idx}
                  {(warning || danger) && (
                    <Tooltip
                      content={
                        warning
                          ? MESSAGE.MyPage.Tooltip.MintWarning
                          : MESSAGE.MyPage.Tooltip.MintDanger
                      }
                    >
                      <Icon name="warning" size={16} />
                    </Tooltip>
                  )}
                </span>
              ),
              bold: true,
            },
            {
              key: "asset",
              title: "Minted assets",
              children: [
                {
                  key: "symbol",
                  title: "Ticker",
                  render: (symbol) => lookupSymbol(symbol),
                  bold: true,
                },
                {
                  key: "balance",
                  dataIndex: "asset",
                  title: "Balance",
                  render: ({ amount, symbol }) => format(amount, symbol),
                  align: "right",
                },
                {
                  key: "value",
                  title: "Value",
                  render: (value) => formatAsset(value, UUSD),
                  align: "right",
                  narrow: !hideChange ? ["right"] : undefined,
                },
                ...insertIf(!hideChange, {
                  key: "change",
                  title: "",
                  render: (change: string) => <Change>{change}</Change>,
                  align: "right" as const,
                  narrow: ["left"],
                }),
              ],
            },
            {
              key: "collateral",
              title: "Collaterals",
              children: [
                {
                  key: "symbol",
                  title: "Ticker",
                  render: (symbol) => lookupSymbol(symbol),
                  bold: true,
                },
                {
                  key: "balance",
                  dataIndex: "collateral",
                  title: "Balance",
                  render: ({ amount, symbol }) => format(amount, symbol),
                  align: "right",
                },
                {
                  key: "value",
                  title: "Value",
                  render: (value) => formatAsset(value, UUSD),
                  align: "right",
                  narrow: !hideChange ? ["right"] : undefined,
                },
                ...insertIf(!hideChange, {
                  key: "change",
                  title: "",
                  render: (change: string) => <Change>{change}</Change>,
                  align: "right" as const,
                  narrow: ["left"],
                }),
              ],
            },
            {
              key: "ratio",
              title: "Collateral Ratio (Min.)",
              render: (value, { minRatio, warning, danger }) => {
                const content = `${percent(value)} (${percent(minRatio)})`
                return warning || danger ? (
                  <strong className="red">{content}</strong>
                ) : (
                  content
                )
              },
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "idx",
              render: (idx) => {
                const to = {
                  pathname: getPath(MenuKey.MINT),
                  search: `idx=${idx}`,
                }
                const list = [
                  {
                    to: { ...to, hash: Type.DEPOSIT },
                    children: Type.DEPOSIT,
                  },
                  {
                    to: { ...to, hash: Type.WITHDRAW },
                    children: Type.WITHDRAW,
                  },
                  {
                    to: { ...to, hash: Type.CLOSE },
                    children: `${Type.CLOSE} position`,
                  },
                ]

                return <DashboardActions list={list} />
              },
              align: "right",
            },
          ]}
          dataSource={dataSource}
        />
      ) : (
        !loading && (
          <NoAssets
            description={MESSAGE.MyPage.Empty.Minted}
            link={MenuKey.MINT}
          />
        )
      )}
    </Card>
  )
}

export default Minted

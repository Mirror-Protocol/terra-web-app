import React, { ReactNode } from "react"
import { isNil } from "ramda"
import classNames from "classnames"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltips from "../../lang/Tooltip.json"
import { UST, UUSD } from "../../constants"
import { lt, lte, minus, sum, times } from "../../libs/math"
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
import Tooltip, { TooltipIcon } from "../../components/Tooltip"
import { Type } from "../Mint"
import NoAssets from "./NoAssets"
import Delisted from "./Delisted"
import DashboardActions from "./DashboardActions"
import styles from "./Mint.module.scss"

const WARNING = 0.3
const DANGER = 0

const Mint = () => {
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
  const { whitelist, parseToken } = useContractsAddress()
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
          const collateralPrice = find(priceKey, collateral.token)
          const collateralValue = times(collateral.amount, collateralPrice)
          const collateralChange = calcChange({
            today: collateralPrice,
            yesterday: yesterday[collateral.token],
          })

          /* asset */
          const asset = parseToken(position.asset)
          const assetPrice = find(priceKey, asset.token)
          const assetValue = times(asset.amount, assetPrice)
          const assetChange = calcChange({
            today: assetPrice,
            yesterday: yesterday[asset.token],
          })

          /* ratio */
          const minRatio = find(AssetInfoKey.MINCOLLATERALRATIO, asset.token)

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
    <TooltipIcon content={tooltip}>{formatAsset(value, UUSD)}</TooltipIcon>
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
          title: "Total Minted Value",
          content: renderTooltip(totalAssetValue, Tooltips.My.TotalAssetValue),
        },
        {
          title: "Total Collateral Value",
          content: renderTooltip(
            totalCollateralValue,
            Tooltips.My.TotalCollateralValue
          ),
        },
      ]}
    />
  )

  return (
    <Card
      title={<TooltipIcon content={Tooltips.My.Mint}>Mint</TooltipIcon>}
      description={description}
      loading={loading}
    >
      {dataExists ? (
        <Table
          rows={({ warning, danger }) => ({
            background: warning || danger ? "red" : undefined,
          })}
          columns={[
            {
              key: "idx",
              title: "ID",
              render: (idx, { warning, danger, collateral, asset }) => {
                const isCollateralDelisted =
                  collateral.token !== UUSD &&
                  whitelist[collateral.token]["status"] === "DELISTED"
                const isAssetDelisted =
                  whitelist[asset.token]["status"] === "DELISTED"
                const isDelisted = isCollateralDelisted || isAssetDelisted

                const shouldWarn = warning || danger
                const className = classNames(styles.idx, { red: shouldWarn })
                const tooltip = warning
                  ? Tooltips.My.PositionWarning
                  : Tooltips.My.PositionDanger

                return (
                  <>
                    {isDelisted && <Delisted />}
                    <span className={className}>
                      {idx}
                      {shouldWarn && (
                        <Tooltip content={tooltip}>
                          <Icon name="warning" size={16} />
                        </Tooltip>
                      )}
                    </span>
                  </>
                )
              },
              bold: true,
            },
            {
              key: "asset.symbol",
              title: "Ticker",
              render: (symbol) => lookupSymbol(symbol),
              bold: true,
            },
            {
              key: "asset.price",
              title: "Oracle Price",
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
            },
            {
              key: "balance",
              title: renderList([
                <TooltipIcon content={Tooltips.My.MintedBalance}>
                  Minted Balance
                </TooltipIcon>,
                <TooltipIcon content={Tooltips.My.CollateralBalance}>
                  Collateral Balance
                </TooltipIcon>,
              ]),
              render: (_, { asset, collateral }) =>
                renderList([
                  formatAsset(asset.amount, asset.symbol),
                  formatAsset(collateral.amount, collateral.symbol),
                ]),
              align: "right",
            },
            {
              key: "value",
              title: renderList([
                <TooltipIcon content={Tooltips.My.MintedValue}>
                  Minted Value
                </TooltipIcon>,
                <TooltipIcon content={Tooltips.My.CollateralValue}>
                  Collateral Value
                </TooltipIcon>,
              ]),
              render: (_, { asset, collateral }) =>
                renderList([
                  formatAsset(asset.value, UUSD),
                  formatAsset(collateral.value, UUSD),
                ]),
              align: "right",
              narrow: !hideChange ? ["right"] : undefined,
            },
            {
              key: "change",
              title: "",
              render: (_, { asset, collateral }) =>
                renderList([
                  <Change>{asset.change}</Change>,
                  <Change>{collateral.change}</Change>,
                ]),
              narrow: ["left"],
            },
            {
              key: "ratio",
              title: (
                <TooltipIcon content={Tooltips.My.CollateralRatio}>
                  Col. Ratio (Min.)
                </TooltipIcon>
              ),
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
              fixed: "right",
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

export default Mint

const renderList = (list: ReactNode[]) => (
  <ul>
    {list.map((item, index) => (
      <li className={styles.item} key={index}>
        {item}
      </li>
    ))}
  </ul>
)

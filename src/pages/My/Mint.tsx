import { ReactNode } from "react"
import classNames from "classnames"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltips from "../../lang/Tooltip.json"
import { UST, UUSD } from "../../constants"
import { format, formatAsset, lookupSymbol } from "../../libs/parse"
import { percent } from "../../libs/num"
import { getPath, MenuKey } from "../../routes"
import Card from "../../components/Card"
import Table from "../../components/Table"
import Dl from "../../components/Dl"
import Icon from "../../components/Icon"
import Button from "../../components/Button"
import Change from "../../components/Change"
import Tooltip, { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import { Type } from "../Mint"
import NoAssets from "./NoAssets"
import styles from "./Mint.module.scss"

interface AssetData extends Asset {
  price: string
  value: string
  change?: string
  delisted: boolean
}

interface Data {
  idx: string
  collateral: AssetData
  asset: AssetData
  ratio?: string
  minRatio: string
  danger: boolean
  warning: boolean
}

interface Props {
  loading: boolean
  totalMintedValue: string
  totalCollateralValue: string
  dataSource: Data[]
  more?: () => void
}

const Mint = ({ loading, dataSource, ...props }: Props) => {
  const { totalMintedValue, totalCollateralValue, more } = props

  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>{formatAsset(value, UUSD)}</TooltipIcon>
  )

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <Dl
      list={[
        {
          title: "Total Minted Value",
          content: renderTooltip(totalMintedValue, Tooltips.My.TotalAssetValue),
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
                const isDelisted = collateral.delisted || asset.delisted
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
              narrow: ["right"],
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

      {more && (
        <Button onClick={more} block outline submit>
          More
        </Button>
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

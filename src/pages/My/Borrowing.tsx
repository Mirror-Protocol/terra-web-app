import classNames from "classnames/bind"
import Tooltips from "../../lang/Tooltips"
import { plus } from "../../libs/math"
import { formatAsset, lookupSymbol } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"
import { useMyBorrowing } from "../../data/my/borrowing"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Icon from "../../components/Icon"
import Tooltip, { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import { MintType } from "../../types/Types"
import CollateralRatio from "../../forms/modules/CollateralRatio"
import ShortBadge from "./ShortBadge"
import CaptionData from "./CaptionData"
import styles from "./Borrowing.module.scss"

const cx = classNames.bind(styles)

const Borrowing = () => {
  const { dataSource, totalMintedValue, totalCollateralValue } =
    useMyBorrowing()

  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>≈ {formatAsset(value, "uusd")}</TooltipIcon>
  )

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <CaptionData
      list={[
        {
          title: "Borrowed",
          content: renderTooltip(
            totalMintedValue,
            Tooltips.My.TotalBorrowedValue
          ),
        },
        {
          title: "Collateral",
          content: renderTooltip(
            totalCollateralValue,
            Tooltips.My.TotalCollateralValue
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
            title={
              <TooltipIcon content={Tooltips.My.Borrowing}>
                Borrowing
              </TooltipIcon>
            }
            description={description}
          />
        }
        rowKey="idx"
        rows={({ state }) => ({
          background: state ? "red" : undefined,
        })}
        columns={[
          {
            key: "mintedAsset",
            title: ["Ticker", "ID"],
            render: (
              { symbol, delisted },
              { idx, state, is_short, willBeLiquidated }
            ) => {
              const tooltip = willBeLiquidated
                ? Tooltips.My.PositionDanger
                : state === "danger"
                ? Tooltips.My.PositionWarning
                : undefined

              const className = cx(styles.ticker, { red: tooltip })

              return [
                <>
                  {delisted && <Delisted />}
                  <span className={className}>
                    {tooltip && (
                      <Tooltip content={tooltip}>
                        <Icon name="ExclamationCircleSolid" size={16} />
                      </Tooltip>
                    )}

                    {lookupSymbol(symbol)}

                    {is_short && <ShortBadge />}
                  </span>
                </>,

                idx,
              ]
            },
            bold: true,
          },
          {
            key: "mintedAsset.price",
            title: "Oracle Price",
            render: (value) => <Formatted unit="UST">{value}</Formatted>,
            align: "right",
          },
          {
            key: "borrowed",
            dataIndex: "mintedAsset",
            title: (
              <TooltipIcon content={Tooltips.My.Borrowed}>Borrowed</TooltipIcon>
            ),
            render: ({ amount, symbol, value }) => [
              <Formatted symbol={symbol}>{amount}</Formatted>,
              <Formatted symbol="uusd">{value}</Formatted>,
            ],
            align: "right",
          },
          {
            key: "collateralAsset",
            title: (
              <TooltipIcon content={Tooltips.My.Collateral}>
                Collateral
              </TooltipIcon>
            ),
            render: ({ delisted, token, amount, symbol, value }) => {
              const amountContent = (
                <>
                  {delisted && <Delisted />}
                  <Formatted symbol={symbol}>{amount}</Formatted>
                </>
              )

              const valueContent = <Formatted symbol="uusd">{value}</Formatted>

              return token === "uusd"
                ? amountContent
                : [amountContent, valueContent]
            },
            align: "right",
          },
          {
            key: "ratio",
            title: (
              <TooltipIcon content={Tooltips.My.CollateralRatio}>
                Collateral Ratio
              </TooltipIcon>
            ),
            render: (value, { minRatio }) => (
              <CollateralRatio
                min={minRatio}
                safe={plus(minRatio, 0.5)}
                ratio={value}
                compact
              />
            ),
            align: "right",
          },
          {
            key: "actions",
            dataIndex: "idx",
            render: (idx) => (
              <LinkButton
                to={{
                  pathname: getPath(MenuKey.MINT),
                  search: `idx=${idx}`,
                  hash: MintType.EDIT,
                }}
                size="xs"
                outline
              >
                Manage
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

export default Borrowing

import classNames from "classnames"
import Tooltips from "../../lang/Tooltips"
import { lt, lte, minus, plus } from "../../libs/math"
import { decimal, formatAsset, lookupSymbol } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"
import { useMyBorrowing } from "../../data/my/borrowing"
import { useGetMinRatio } from "../../data/contract/collateral"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Icon from "../../components/Icon"
import Tooltip, { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import { MintType } from "../../types/Types"
import CollateralRatio from "../../forms/CollateralRatio"
import ShortBadge from "./ShortBadge"
import CaptionData from "./CaptionData"
import styles from "./Borrowing.module.scss"

const WARNING = 0.3
const DANGER = 0

const Borrowing = () => {
  const { totalMintedValue, totalCollateralValue, ...borrowing } =
    useMyBorrowing()
  const getMinRatio = useGetMinRatio()

  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>≈ {formatAsset(value, "uusd")}</TooltipIcon>
  )

  const dataSource = borrowing.dataSource.map((row) => {
    const { ratio, collateralAsset, mintedAsset } = row
    const minRatio = getMinRatio(collateralAsset.token, mintedAsset.token)
    const state = lt(minus(ratio, minRatio), DANGER)
      ? "danger"
      : lte(minus(ratio, minRatio), WARNING)
      ? "warning"
      : ""

    return { ...row, minRatio, state }
  })

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
        rows={({ state }) => ({
          background: state ? "red" : undefined,
        })}
        columns={[
          {
            key: "mintedAsset",
            title: ["Ticker", "ID"],
            render: ({ symbol, status }, { idx, state, is_short }) => {
              const className = classNames(styles.idx, { red: state })
              const tooltip =
                state === "warning"
                  ? Tooltips.My.PositionWarning
                  : Tooltips.My.PositionDanger

              return [
                <>
                  {status === "DELISTED" && <Delisted />}
                  <span className={className}>
                    {state && (
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
            title: (
              <TooltipIcon content={Tooltips.My.Borrowed}>Borrowed</TooltipIcon>
            ),
            render: (_, { mintedAsset }) => [
              <Formatted symbol={mintedAsset.symbol}>
                {mintedAsset.amount}
              </Formatted>,
              <Formatted symbol="uusd">{mintedAsset.value}</Formatted>,
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
            render: (_, { collateralAsset }) => {
              const amount = (
                <>
                  {collateralAsset.delisted && <Delisted />}
                  <Formatted symbol={collateralAsset.symbol}>
                    {collateralAsset.amount}
                  </Formatted>
                </>
              )

              const value = (
                <Formatted symbol="uusd">{collateralAsset.value}</Formatted>
              )

              return collateralAsset.token === "uusd" ? amount : [amount, value]
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
                ratio={decimal(value, 2)}
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

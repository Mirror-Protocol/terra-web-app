import { gt, minus, number } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { useTerraAssetList } from "../../data/stats/list"

import Table from "../../components/Table"
import Formatted from "../../components/Formatted"
import Percent from "../../components/Percent"
import AssetItem from "../../components/AssetItem"
import useListFilter, { Sorter } from "../../components/useListFilter"
import AssetsIdleTable from "../../containers/AssetsIdleTable"
import { MintType } from "../../types/Types"

const Sorters: Dictionary<Sorter> = {
  MARKETCAP: {
    label: "Market Cap",
    compare: (a, b) => number(minus(b.marketCap, a.marketCap)),
  },
  COLLATERALVALUE: {
    label: "Collateral Value",
    compare: (a, b) => number(minus(b.collateralValue, a.collateralValue)),
  },
  MINCOLLATERALRATIO: {
    label: "Min Collateral Ratio",
    compare: (a, b) =>
      number(minus(b.minCollateralRatio, a.minCollateralRatio)),
  },
}

const BorrowList = () => {
  const list = useTerraAssetList()
  const { filter, compare, renderSearch } = useListFilter("MARKETCAP", Sorters)

  const dataSource = list
    .filter(({ symbol }) => symbol !== "MIR")
    .filter(({ name, symbol }) => [name, symbol].some(filter))
    .sort(compare)

  return (
    <>
      {renderSearch()}
      {!list.length ? (
        <AssetsIdleTable />
      ) : (
        <Table
          rows={({ token }) => ({
            to: { hash: MintType.BORROW, state: { token } },
          })}
          columns={[
            {
              key: "token",
              title: "Ticker",
              render: (token) => <AssetItem token={token} />,
              width: "25%",
              bold: true,
            },
            {
              key: PriceKey.ORACLE,
              title: "Oracle Price",
              render: (price) =>
                gt(price, 0) && <Formatted unit="UST">{price}</Formatted>,
              align: "right",
            },
            {
              key: "minCollateralRatio",
              title: "Min Collateral Ratio",
              render: (value) => <Percent>{value}</Percent>,
              align: "right",
              desktop: true,
            },
            {
              key: "marketCap",
              title: "Market Cap",
              render: (value) =>
                gt(value, 0) && <Formatted symbol="uusd">{value}</Formatted>,
              align: "right",
              desktop: true,
            },
            {
              key: "collateralValue",
              title: "Collateral Value",
              render: (value) =>
                gt(value, 0) && <Formatted symbol="uusd">{value}</Formatted>,
              align: "right",
              desktop: true,
            },
          ]}
          dataSource={dataSource}
        />
      )}
    </>
  )
}

export default BorrowList

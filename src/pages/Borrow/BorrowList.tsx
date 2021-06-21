import { gt } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { useTerraAssetList } from "../../data/stats/list"

import Table from "../../components/Table"
import Formatted from "../../components/Formatted"
import AssetItem from "../../components/AssetItem"
import useListFilter, { Sorter } from "../../components/useListFilter"
import AssetsIdleTable from "../../containers/AssetsIdleTable"
import { MintType } from "../../types/Types"

const Sorters: Dictionary<Sorter> = {}

const BorrowList = () => {
  const list = useTerraAssetList()
  const { filter, compare, renderSearch } = useListFilter("", Sorters)

  const dataSource = list
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
          ]}
          dataSource={dataSource}
        />
      )}
    </>
  )
}

export default BorrowList

import { sort } from "ramda"
import { gt } from "../../libs/math"
import { useProtocol } from "../../data/contract/protocol"
import { useFindPairPrice } from "../../data/contract/normalize"
import { useAssetsHelpers } from "../../data/stats/assets"
import Table from "../../components/Table"
import Formatted from "../../components/Formatted"
import AssetItem from "../../components/AssetItem"
import { MarketType } from "../../types/Types"
import { getPath, MenuKey } from "../../routes"
import styles from "./TopTradingTable.module.scss"

const TopTradingTable = () => {
  const { listed } = useProtocol()
  const { volume } = useAssetsHelpers()
  const findPrice = useFindPairPrice()

  const dataSource = sort(
    (a, b) => (gt(volume(b.token), volume(a.token)) ? 1 : -1),
    listed
  )

  return (
    <Table
      rows={({ token }) => ({
        to: {
          pathname: getPath(MenuKey.TRADE),
          hash: MarketType.BUY,
          state: { token },
        },
      })}
      columns={[
        {
          key: "token",
          render: (token) => <AssetItem token={token} />,
          bold: true,
        },
        {
          key: "price",
          dataIndex: "token",
          render: (token) => (
            <Formatted className={styles.price} unit="UST">
              {findPrice(token)}
            </Formatted>
          ),
          align: "right",
        },
      ]}
      dataSource={dataSource.slice(0, 4)}
      config={{ hideHeader: true, noRadius: true, darker: true }}
    />
  )
}

export default TopTradingTable

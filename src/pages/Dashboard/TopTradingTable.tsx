import { useRecoilValue } from "recoil"
import { minus, number } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { useProtocol } from "../../data/contract/protocol"
import { useAssetsHelpersByNetwork } from "../../data/stats/assets"
import { dashboardNetworkState } from "../../data/stats/statistic"
import Table from "../../components/Table"
import Formatted from "../../components/Formatted"
import AssetItem from "../../components/AssetItem"
import { MarketType } from "../../types/Types"
import { getPath, MenuKey } from "../../routes"
import styles from "./TopTradingTable.module.scss"

const TopTradingTable = () => {
  const { listed } = useProtocol()
  const network = useRecoilValue(dashboardNetworkState)
  const { [PriceKey.PAIR]: findPrice, volume } =
    useAssetsHelpersByNetwork(network)

  const dataSource = listed
    .map((item) => ({
      ...item,
      price: findPrice(item.token),
      volume: volume(item.token),
    }))
    .sort(({ volume: a }, { volume: b }) => number(minus(b, a)))
    .slice(0, 4)

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
          render: (price) => (
            <Formatted className={styles.price} unit="UST">
              {price}
            </Formatted>
          ),
          align: "right",
        },
      ]}
      dataSource={dataSource}
      config={{ hideHeader: true, noRadius: true, darker: true }}
    />
  )
}

export default TopTradingTable

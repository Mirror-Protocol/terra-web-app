import { useProtocol } from "../data/contract/protocol"
import AssetItem from "../components/AssetItem"
import Table from "../components/Table"

const AssetsIdleTable = () => {
  const { listed } = useProtocol()

  return (
    <Table
      rowKey="token"
      columns={[
        {
          key: "token",
          title: "Ticker",
          render: (token) => <AssetItem token={token} idle />,
        },
      ]}
      dataSource={listed}
    />
  )
}

export default AssetsIdleTable

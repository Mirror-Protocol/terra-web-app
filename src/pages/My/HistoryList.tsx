import Button, { Submit } from "../../components/Button"
import Caption from "../../components/Caption"
import Table from "../../components/Table"
import DownloadCSV from "./DownloadCSV"
import HistoryItem from "./HistoryItem"

interface Props {
  data: Tx[]
  loading: boolean
  more?: () => void
}

const HistoryList = ({ data, loading, more }: Props) => {
  return !data.length ? null : (
    <>
      <Table
        caption={
          <Caption
            title="Transaction History"
            action={<DownloadCSV txs={data} />}
            loading={loading}
          />
        }
        columns={[
          { key: "id", render: (id, item) => <HistoryItem {...item} /> },
        ]}
        dataSource={data}
        config={{ hideHeader: true }}
      />

      {more && (
        <Submit>
          <Button color="secondary" onClick={more} block loading={loading}>
            More
          </Button>
        </Submit>
      )}
    </>
  )
}

export default HistoryList

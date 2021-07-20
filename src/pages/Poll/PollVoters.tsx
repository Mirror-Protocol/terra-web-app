import { useRecoilValue } from "recoil"
import { formatAsset } from "../../libs/parse"
import { useNetwork } from "../../hooks"
import { govVotersQuery } from "../../data/gov/vote"
import Table from "../../components/Table"
import ExtLink from "../../components/ExtLink"

const PollVoters = ({ id }: { id: number }) => {
  const { finder } = useNetwork()
  const voters = useRecoilValue(govVotersQuery(id))

  return !voters?.length ? null : (
    <Table
      rowKey="voter"
      columns={[
        {
          key: "voter",
          render: (address) => (
            <ExtLink href={finder(address)}>{address}</ExtLink>
          ),
        },
        { key: "vote", render: (answer) => answer.toUpperCase() },
        {
          key: "balance",
          render: (amount) => formatAsset(amount, "MIR"),
          align: "right",
        },
      ]}
      dataSource={voters}
    />
  )
}

export default PollVoters

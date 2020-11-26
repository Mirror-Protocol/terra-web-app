import { MIR } from "../../constants"
import { formatAsset } from "../../libs/parse"
import { useVoters } from "../../graphql/useGov"
import { useNetwork } from "../../hooks"
import Table from "../../components/Table"
import ExtLink from "../../components/ExtLink"

const PollVoters = ({ id }: { id: number }) => {
  const { finder } = useNetwork()
  const { voters } = useVoters(id)

  return !voters?.length ? null : (
    <Table
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
          render: (amount) => formatAsset(amount, MIR),
          align: "right",
        },
      ]}
      dataSource={voters}
    />
  )
}

export default PollVoters

import { gt } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { capitalize } from "../../libs/utils"
import { useMyGov } from "../../data/my/gov"

import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import { TooltipIcon } from "../../components/Tooltip"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import CaptionData from "./CaptionData"

const Gov = () => {
  const { dataSource, accReward, staked, votingRewards } = useMyGov()
  const dataExists = !!dataSource.length || gt(staked, 0)
  const description = dataExists && (
    <CaptionData
      list={[
        {
          title: "Staked MIR",
          content: formatAsset(staked, "MIR"),
        },
        {
          title: "Accumulated Staking Rewards",
          content: formatAsset(accReward, "MIR"),
        },
        {
          title: "Voting Rewards",
          content: formatAsset(votingRewards, "MIR"),
        },
      ]}
    />
  )

  return (
    <Table
      caption={
        <Caption
          title={<TooltipIcon>Govern</TooltipIcon>}
          description={description}
        />
      }
      columns={[
        {
          key: "title",
          dataIndex: "title",
          title: ["Title", "Poll ID"],
          render: (title, { id }) => ["", id],
          bold: true,
        },
        {
          key: "vote",
          render: (answer) => capitalize(answer),
          align: "center",
        },
        {
          key: "amount",
          title: "Vote MIR",
          render: (amount) => <Formatted symbol="MIR">{amount}</Formatted>,
          align: "right",
        },
        {
          key: "reward",
          render: (amount) =>
            gt(amount, 0) && <Formatted symbol="MIR">{amount}</Formatted>,
          align: "right",
        },
        {
          key: "actions",
          dataIndex: "id",
          render: (id) => (
            <LinkButton
              to={[getPath(MenuKey.GOV), "poll", id].join("/")}
              size="xs"
              outline
            >
              Poll Detail
            </LinkButton>
          ),
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default Gov

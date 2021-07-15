import Tooltips from "../../lang/Tooltips"
import { gt } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { capitalize } from "../../libs/utils"
import { secondsToDate } from "../../libs/date"
import { useMyGov } from "../../data/my/gov"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import { TooltipIcon } from "../../components/Tooltip"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import CaptionData from "./CaptionData"
import styles from "./Gov.module.scss"

const Gov = () => {
  const { dataSource, staked, votingRewards } = useMyGov()
  const dataExists = !!dataSource.length || gt(staked, 0)
  const description = dataExists && (
    <CaptionData
      list={[
        {
          title: <TooltipIcon content={Tooltips.My.Staked}>Staked</TooltipIcon>,
          content: formatAsset(staked, "MIR"),
        },
        {
          title: (
            <TooltipIcon content={Tooltips.My.VotingRewards}>
              Voting Rewards
            </TooltipIcon>
          ),
          content: formatAsset(votingRewards, "MIR"),
        },
      ]}
    />
  )

  return (
    <Table
      caption={
        <Caption
          title={<TooltipIcon content={Tooltips.My.Govern}>Govern</TooltipIcon>}
          description={description}
        />
      }
      rowKey="id"
      columns={[
        {
          key: "title",
          dataIndex: "title",
          title: ["Title", "Poll ID"],
          render: (title, { id, end_time }) => [
            <h1 className={styles.title}>{title}</h1>,
            [id, `(End time: ${secondsToDate(end_time)})`].join(" "),
          ],
          bold: true,
        },
        {
          key: "vote",
          render: (answer) => capitalize(answer),
          align: "center",
        },
        {
          key: "balance",
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
          render: (id, { reward }) => {
            const hasReward = reward && gt(reward, 0)
            const path = getPath(MenuKey.GOV)
            const to = [path, "poll", id, hasReward ? "claim" : ""].join("/")

            return (
              <LinkButton to={to} size="xs" outline>
                {hasReward ? "Claim Reward" : "Poll Detail"}{" "}
              </LinkButton>
            )
          },
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default Gov

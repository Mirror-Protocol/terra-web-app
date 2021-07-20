import { insertIf } from "../../libs/utils"
import { Poll } from "../../data/gov/poll"
import Dl from "../../components/Dl"
import PreLine from "../../components/PreLine"
import ExtLink from "../../components/ExtLink"

const PollSummary = ({ description, link, contents = [] }: Poll) => {
  return (
    <Dl
      list={[
        {
          title: "Description",
          content: <PreLine>{description}</PreLine>,
        },
        ...insertIf(link, {
          title: "Link",
          content: <ExtLink href={link}>{link}</ExtLink>,
        }),
        ...contents,
      ]}
      type="vertical"
    />
  )
}

export default PollSummary

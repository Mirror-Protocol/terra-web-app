import { percent } from "../../libs/num"
import { insertIf } from "../../libs/utils"
import Dl from "../../components/Dl"
import PreLine from "../../components/PreLine"
import ExtLink from "../../components/ExtLink"

const PollSummary = ({ description, link, msg, params }: Poll) => (
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
      ...parseContents(msg),
      ...parseContents(params, percent),
    ]}
    type="vertical"
  />
)

export default PollSummary

/* helpers */
const parseContents = (
  object?: object,
  format?: (value: string) => string
): Content[] =>
  !object
    ? []
    : Object.entries(object).reduce<Content[]>(
        (acc, [title, content]) => [
          ...acc,
          ...insertIf(typeof content === "string", {
            title: getTitle(title),
            content: format?.(content) ?? content,
          }),
        ],
        []
      )

export const getTitle = (title: string) => title.replace(/_/g, " ")

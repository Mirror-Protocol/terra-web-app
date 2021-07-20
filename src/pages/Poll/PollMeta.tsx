import { truncate } from "../../libs/text"
import { useNetwork } from "../../hooks"
import { Poll } from "../../data/gov/poll"
import Dl from "../../components/Dl"
import ExtLink from "../../components/ExtLink"
import usePollTimeText from "./usePollTimeText"
import styles from "./PollMeta.module.scss"

const PollMeta = (poll: Poll) => {
  const { finder } = useNetwork()
  const pollTimeText = usePollTimeText(poll)
  const { creator } = poll

  return (
    <>
      <Dl
        list={[
          {
            title: "Creator",
            content: (
              <ExtLink href={finder(creator)}>{truncate(creator)}</ExtLink>
            ),
          },
          {
            title: pollTimeText.label,
            content: pollTimeText.text,
          },
        ]}
        className={styles.dl}
      />
    </>
  )
}

export default PollMeta

import { truncate } from "../../libs/text"
import { useNetwork } from "../../hooks"
import Dl from "../../components/Dl"
import ExtLink from "../../components/ExtLink"
import useEstimateTime from "./useEstimateTime"
import styles from "./PollMeta.module.scss"

const PollMeta = (poll: Poll) => {
  const { finder } = useNetwork()
  const estimatedTime = useEstimateTime(poll)
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
            title: estimatedTime.label,
            content: estimatedTime.text,
          },
        ]}
        className={styles.dl}
      />
    </>
  )
}

export default PollMeta

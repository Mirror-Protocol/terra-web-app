import React from "react"
import { truncate } from "../../libs/text"
import { useNetwork } from "../../hooks"
import Dl from "../../components/Dl"
import ExtLink from "../../components/ExtLink"
import useEstimateTime from "./useEstimateTime"
import styles from "./PollMeta.module.scss"

const PollMeta = ({ id, creator, end_height }: Poll) => {
  const { finder } = useNetwork()
  const estimatedTime = useEstimateTime(id)

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
            title: "Estimated End Time",
            content: estimatedTime.end,
          },
        ]}
        className={styles.dl}
      />
    </>
  )
}

export default PollMeta

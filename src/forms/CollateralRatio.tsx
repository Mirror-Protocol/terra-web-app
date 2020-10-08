import React from "react"
import { times, div, gt, gte, lt } from "../libs/math"
import { percent } from "../libs/num"
import Progress from "../components/Progress"
import styles from "./CollateralRatio.module.scss"

interface Props {
  min: string
  safe: string
  next: string
  prev?: string
  onClick: (ratio: string) => void
}

const MAX = 3
const getX = (ratio: string) => div(ratio, MAX)

const CollateralRatio = ({ min, safe, next, onClick }: Props) => (
  <Progress
    data={[
      {
        value: gt(next, 0) ? getX(next) : "0",
        label: gt(next, 0) ? percent(next) : "",
        color: gte(next, safe) ? "blue" : lt(next, min) ? "red" : "orange",
      },
    ]}
    axis={[
      { x: getX(min), label: `Min: ${percent(min)}` },
      { x: getX(safe), label: `Safe: ${percent(safe)}` },
    ]}
    className={styles.progress}
    onClick={(value) => onClick(times(value, MAX))}
  />
)

export default CollateralRatio

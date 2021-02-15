import Tooltip from "../lang/Tooltip.json"
import { times, div, gt, gte, lt } from "../libs/math"
import { percent } from "../libs/num"
import Progress from "../components/Progress"
import { TooltipIcon } from "../components/Tooltip"
import styles from "./CollateralRatio.module.scss"

interface Props {
  min: string
  safe: string
  next: string
  prev?: string
  onClick: (ratio: string) => void
}

const MAX = 4 // 400%
const getX = (ratio: string) => {
  const x = div(ratio, MAX)
  return lt(x, 0) ? "0" : gt(x, 1) ? "1" : x
}

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
      {
        x: getX(min),
        label: (
          <TooltipIcon content={Tooltip.Mint.MinCollateralRatio}>
            Min: {percent(min)}
          </TooltipIcon>
        ),
      },
      {
        x: getX(safe),
        label: (
          <TooltipIcon content={Tooltip.Mint.SafeCollateralRatio}>
            Safe: {percent(safe)}
          </TooltipIcon>
        ),
      },
    ]}
    className={styles.progress}
    onClick={(value) => onClick(times(value, MAX))}
  />
)

export default CollateralRatio

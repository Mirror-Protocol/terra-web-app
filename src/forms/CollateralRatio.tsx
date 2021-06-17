import classNames from "classnames/bind"
import Tooltips from "../lang/Tooltips"
import { times, div, gt, gte, lt } from "../libs/math"
import { percent, percentage } from "../libs/num"
import Progress from "../components/Progress"
import { TooltipIcon } from "../components/Tooltip"
import Formatted from "../components/Formatted"
import styles from "./CollateralRatio.module.scss"

const cx = classNames.bind(styles)

interface Props {
  min: string
  safe: string
  ratio: string
  compact?: boolean
  onClick?: (ratio: string) => void
}

const getX = (ratio: string, min: string) => {
  const x = div(ratio, times(min, 2))
  return lt(x, 0) ? "0" : gt(x, 1) ? "1" : x
}

const CollateralRatio = ({ min, safe, ratio, compact, onClick }: Props) => {
  const minText = `Min: ${percent(min)}`
  const safeText = `Safe: ${percent(safe)}`

  const minX = {
    x: getX(min, min),
    label: compact ? (
      minText
    ) : (
      <TooltipIcon content={Tooltips.Mint.MinCollateralRatio}>
        {minText}
      </TooltipIcon>
    ),
  }

  const safeX = {
    x: getX(safe, min),
    label: compact ? (
      safeText
    ) : (
      <TooltipIcon content={Tooltips.Mint.SafeCollateralRatio}>
        {safeText}
      </TooltipIcon>
    ),
  }

  const color = gte(ratio, safe) ? "blue" : "red"

  return (
    <div className={cx(styles.component, { compact })}>
      {compact && (
        <span className={classNames(styles.percent, color)}>
          <Formatted unit="%">{percentage(ratio)}</Formatted>
        </span>
      )}

      <Progress
        data={[
          {
            value: gt(ratio, 0) ? getX(ratio, min) : "0",
            label: gt(ratio, 0) ? percent(ratio) : "",
            color,
          },
        ]}
        axis={compact ? [minX] : [minX, safeX]}
        onClick={
          onClick ? (value) => onClick(times(value, times(min, 2))) : undefined
        }
        noLabel={compact}
        compact={compact}
      />
    </div>
  )
}

export default CollateralRatio

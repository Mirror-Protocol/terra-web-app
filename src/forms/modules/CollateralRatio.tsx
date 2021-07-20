import classNames from "classnames/bind"
import { COLLATERAL_RATIO } from "../../constants"
import Tooltips from "../../lang/Tooltips"
import { times, div, gt, lt, minus } from "../../libs/math"
import { decimal } from "../../libs/parse"
import { percent, percentage } from "../../libs/num"
import Progress, { ProgressBarColor } from "../../components/Progress"
import { TooltipIcon } from "../../components/Tooltip"
import Formatted from "../../components/Formatted"
import styles from "./CollateralRatio.module.scss"

const cx = classNames.bind(styles)

interface Props {
  min: string
  safe: string
  ratio: string
  compact?: boolean
  onRatio?: (ratio: string) => void
}

const getX = (ratio: string, min: string) => {
  const x = div(ratio, times(min, 2))
  return lt(x, 0) ? "0" : gt(x, 1) ? "1" : x
}

export const getState = (diff: string): "danger" | "warning" | "none" =>
  lt(diff, COLLATERAL_RATIO.DANGER)
    ? "danger"
    : lt(diff, COLLATERAL_RATIO.WARNING)
    ? "warning"
    : "none"

const CollateralRatio = ({ min, safe, ratio, compact, onRatio }: Props) => {
  const minText = `Min: ${percent(min, -1)}`
  const safeText = `Safe: ${percent(safe, -1)}`

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

  const state = getState(minus(ratio, min))
  const color = { none: "blue", warning: "orange", danger: "red" }[
    state
  ] as ProgressBarColor

  return (
    <div className={cx(styles.component, { compact })}>
      {compact && (
        <span className={classNames(styles.percent, color)}>
          {gt(ratio, 0) && <Formatted unit="%">{percentage(ratio)}</Formatted>}
        </span>
      )}

      <Progress
        data={
          gt(ratio, 0) && gt(min, 0)
            ? [{ value: getX(ratio, min), label: percent(ratio), color }]
            : []
        }
        axis={!gt(min, 0) ? [] : compact ? [minX] : [minX, safeX]}
        onPosition={
          onRatio &&
          ((value) => onRatio(decimal(times(value, times(min, 2)), 4)))
        }
        noLabel={compact}
        compact={compact}
      />
    </div>
  )
}

export default CollateralRatio

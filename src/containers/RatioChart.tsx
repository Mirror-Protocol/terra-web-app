import { div, sum } from "../libs/math"
import { percent } from "../libs/num"
import { TooltipIcon } from "../components/Tooltip"
import Legend, { colors } from "./Legend"
import styles from "./RatioChart.module.scss"

interface Props {
  list: { label: string; value: number; tooltip: string }[]
  format: (value: number) => string
}

const RatioChart = ({ list, format }: Props) => {
  const total = sum(list.map(({ value }) => value))

  return (
    <>
      <section className={styles.track}>
        {list.map(({ value }, index) => (
          <div style={{ width: percent(div(value, total)) }} key={index}>
            <div
              className={styles.fill}
              style={{ backgroundColor: colors[index] }}
            />
          </div>
        ))}
      </section>

      <ul className={styles.list}>
        {list.map(({ label, tooltip, value }, index) => (
          <li className={styles.item} key={index}>
            <Legend
              label={<TooltipIcon content={tooltip}>{label}</TooltipIcon>}
              index={index}
            >
              {format(value)}
            </Legend>
          </li>
        ))}
      </ul>
    </>
  )
}

export default RatioChart

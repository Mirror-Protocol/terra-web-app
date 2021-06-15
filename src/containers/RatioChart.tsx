import { div, sum } from "../libs/math"
import { percent } from "../libs/num"
import Legend, { colors } from "./Legend"
import styles from "./RatioChart.module.scss"

interface Props {
  list: { label: string; value: number }[]
  format: (value: number) => string
}

const RatioChart = ({ list, format }: Props) => {
  const total = sum(list.map(({ value }) => value))

  return (
    <>
      <section className={styles.track}>
        {list.map(({ label, value }, index) => (
          <div style={{ width: percent(div(value, total)) }} key={label}>
            <div
              className={styles.fill}
              style={{ backgroundColor: colors[index] }}
            />
          </div>
        ))}
      </section>

      <ul className={styles.list}>
        {list.map(({ label, value }, index) => (
          <li className={styles.item} key={index}>
            <Legend label={label} index={index}>
              {format(value)}
            </Legend>
          </li>
        ))}
      </ul>
    </>
  )
}

export default RatioChart

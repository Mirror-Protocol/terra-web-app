import { ChartData, ChartOptions } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { gt, minus, number } from "../libs/math"
import { TooltipIcon } from "../components/Tooltip"
import Legend, { colors } from "./Legend"
import styles from "./DoughnutChart.module.scss"

interface Props {
  list: { label: string; value: string; tooltip: string }[]
  format: (value: string) => string
}

const DoughnutChart = ({ format, ...props }: Props) => {
  const list = props.list
    .filter(({ value }) => gt(value, 0))
    .sort(({ value: a }, { value: b }) => number(minus(b, a)))

  const data: ChartData = {
    labels: list.map(({ label }) => label),
    datasets: [
      {
        data: list.map(({ value }) => number(value)),
        borderWidth: 0,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        hoverOffset: 0,
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
    cutout: "60%",
    animation: { animateRotate: false },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  }

  return (
    <div className={styles.wrapper}>
      <ul>
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

      <section className={styles.chart}>
        <Doughnut type="doughnut" data={data} options={options} />
      </section>
    </div>
  )
}

export default DoughnutChart

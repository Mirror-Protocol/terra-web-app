import { ChartData, ChartOptions, ScatterDataPoint } from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import "chartjs-adapter-date-fns"
import { format as formatDate } from "date-fns"
import classNames from "classnames/bind"
import { FMT } from "../constants"
import { format } from "../libs/parse"
import styles from "./ChartContainer.module.scss"

const cx = classNames.bind(styles)

/* styles */
const $font = '"Gotham SSm A", "Gotham SSm B"'
const $blue = "#66adff"
const $blue62 = "#55779D"
const $red = "#f15e7e"
const $gray34 = "#555557"
const $gray22 = "#373738"

interface Props {
  change?: number
  datasets: ScatterDataPoint[]
  fmt?: { t: string }
  compact?: boolean
  bar?: boolean
  beginAtZero?: boolean
}

const ChartContainer = ({ change, datasets = [], ...props }: Props) => {
  const { fmt, compact, bar, beginAtZero = false } = props

  const last = datasets[datasets.length - 1]?.y
  const head = datasets[0]?.y
  const borderColor = last > head ? $blue : last < head ? $red : $gray34

  const data: ChartData = {
    datasets: [
      Object.assign(
        {
          fill: !compact,
          backgroundColor: $gray22,
          borderColor: compact ? borderColor : $gray34,
          borderWidth: 2,
          tension: compact ? 0.2 : 0.05,
          pointRadius: 0,
          data: datasets,
        },
        compact
          ? { pointHoverRadius: 0 }
          : {
              pointHoverRadius: 3,
              pointHoverBorderWidth: 3,
              pointHoverBackgroundColor: $blue62,
              pointHoverBorderColor: $blue62,
              hoverBackgroundColor: $blue62,
              hoverBorderColor: $blue62,
            }
      ),
    ],
  }

  const options: ChartOptions<"bar" | "line"> = {
    interaction: { mode: "index", intersect: false },
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    layout: compact ? undefined : { padding: { top: 12 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: !compact,
        mode: "index",
        intersect: false,
        displayColors: false,
        backgroundColor: "transparent",
        cornerRadius: 5,
        titleColor: $blue,
        titleFont: { size: 16, weight: "500", family: $font },
        titleAlign: "center",
        bodyColor: $blue,
        bodyFont: { size: 12, family: $font },
        bodyAlign: "center",
        xAlign: "center",
        yAlign: "bottom",
        callbacks: {
          title: ([{ parsed }]) => format(String(parsed.y)),
          label: ({ parsed }) =>
            fmt
              ? formatDate(new Date(parsed.x), fmt.t)
              : formatDate(new Date(parsed.x), FMT.MMdd).toUpperCase(),
        },
      },
    },
    scales: {
      xAxes: {
        type: "time",
        display: false,
        ticks: {
          source: "auto",
          autoSkip: true,
          autoSkipPadding: 15,
          maxRotation: 0,
        },
        grid: { display: false },
      },

      yAxes: {
        beginAtZero,
        display: false,
        position: "right",
        grid: {
          drawBorder: false,
        },
        ticks: {
          callback: (value) => format(value as string),
          padding: 20,
        },
      },
    },
  }

  const chartProps = { data, options, height: compact ? 24 : undefined }
  const render = () =>
    bar ? (
      <Bar type="bar" {...chartProps} />
    ) : (
      <Line type="line" {...chartProps} />
    )

  return (
    <article className={cx({ compact })}>
      <section className={styles.chart}>
        {datasets.length > 1 && render()}
      </section>
    </article>
  )
}

export default ChartContainer

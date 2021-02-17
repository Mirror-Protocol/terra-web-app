import { ReactNode } from "react"
import { helpers, ChartData, ChartPoint, ChartOptions } from "chart.js"
import { Line, defaults, Bar } from "react-chartjs-2"
import { format as formatDate } from "date-fns"
import { gt, lt } from "../libs/math"
import { format } from "../libs/parse"
import Change from "../components/Change"
import styles from "./ChartContainer.module.scss"

/* styles */
const $font = "Poppins"
const $darkblue = "#172240"
const $aqua = "#47d7e2"
const $red = "#e64c57"
const $slate = "#505466"
const $text = "#cccccc"
const $line = helpers.color($slate).alpha(0.2).rgbString()

defaults.global.defaultFontColor = $slate
defaults.global.defaultFontFamily = $font

interface Props {
  value?: ReactNode
  change?: string
  datasets: ChartPoint[]
  fmt?: { t: string }
  compact?: boolean
  bar?: boolean
}

const ChartContainer = ({ value, change, datasets, ...props }: Props) => {
  const { fmt, compact, bar } = props

  const borderColor =
    (change && (gt(change, 0) ? $aqua : lt(change, 0) && $red)) || $text

  const height = compact ? 120 : 240

  const data: ChartData = {
    datasets: [
      {
        fill: false,
        borderColor,
        borderCapStyle: "round",
        borderWidth: compact ? 2 : 6,
        lineTension: compact ? 0.2 : 0.05,
        pointRadius: 0,
        pointHoverRadius: 0,
        data: datasets,
      },
    ],
  }

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    legend: { display: false },
    layout: compact ? { padding: 20 } : undefined,
    scales: {
      xAxes: [
        {
          offset: true,
          type: "time",
          display: !compact,
          ticks: {
            source: "data",
            autoSkip: true,
            autoSkipPadding: 15,
            maxRotation: 0,
          },
          gridLines: { display: false },
        },
      ],
      yAxes: [
        {
          display: !compact,
          position: "right",
          gridLines: {
            drawBorder: false,
            color: $line,
            zeroLineColor: $line,
          },
          ticks: {
            callback: (value) => format(value as string),
            padding: 20,
          },
        },
      ],
    },
    tooltips: {
      mode: "index",
      intersect: false,
      displayColors: false,
      backgroundColor: "white",
      cornerRadius: 5,
      titleFontColor: $darkblue,
      titleFontSize: 16,
      titleFontStyle: "600",
      bodyFontColor: $darkblue,
      bodyFontSize: 12,
      xPadding: 10,
      yPadding: 8,
      callbacks: {
        title: ([{ value }]) => (value ? format(value) : ""),
        label: ({ label }) =>
          label
            ? fmt
              ? formatDate(new Date(label), fmt.t)
              : new Date(label).toDateString()
            : "",
      },
    },
  }

  const chartProps = { height, data, options }

  return (
    <article>
      {value && (
        <header className={styles.header}>
          <strong className={styles.value}>{value}</strong>
          <Change className={styles.change}>{change}</Change>
        </header>
      )}

      {datasets.length > 1 && (
        <section className={styles.chart}>
          {bar ? <Bar {...chartProps} /> : <Line {...chartProps} />}
        </section>
      )}
    </article>
  )
}

export default ChartContainer

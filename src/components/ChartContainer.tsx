import React, { ReactNode } from "react"
import { helpers, ChartPoint } from "chart.js"
import { Line, defaults } from "react-chartjs-2"
import { gt, lt } from "../libs/math"
import { format } from "../libs/parse"
import Change from "./Change"
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
  value: ReactNode
  change?: string
  datasets: ChartPoint[]
}

const ChartContainer = ({ value, change, datasets }: Props) => {
  const borderColor =
    (change && (gt(change, 0) ? $aqua : lt(change, 0) && $red)) || $text

  return (
    <article>
      <header className={styles.header}>
        <strong className={styles.value}>{value}</strong>
        <Change className={styles.change}>{change}</Change>
      </header>

      {datasets.length > 1 && (
        <section className={styles.chart}>
          <Line
            height={240}
            data={{
              datasets: [
                {
                  fill: false,
                  borderColor,
                  borderCapStyle: "round",
                  borderWidth: 6,
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  data: datasets,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 0 },
              legend: { display: false },
              scales: {
                xAxes: [
                  {
                    type: "time",
                    ticks: { source: "data" },
                    gridLines: { display: false },
                  },
                ],
                yAxes: [
                  {
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
                    label ? new Date(label).toDateString() : "",
                },
              },
            }}
          />
        </section>
      )}
    </article>
  )
}

export default ChartContainer

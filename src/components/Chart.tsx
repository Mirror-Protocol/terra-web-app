import React, { useRef, useEffect, useState } from "react"
import { path } from "ramda"
import { debounce, merge as mergeDeep } from "lodash"
import ChartJS, { ChartOptions, ChartXAxe, ChartYAxe } from "chart.js"
import { div } from "libs/math"
import { formatMoney } from "libs/parse"

type ChartType = "doughnut" | "line" | "pie"
export type Props = {
  type?: ChartType
  pieBackgroundColors?: string[]
  lineStyle?: ChartJS.ChartDataSets
  labels?: string[]
  data?: number[] | ChartJS.ChartPoint[]
  options?: ChartJS.ChartOptions
  width?: number
  height?: number
}

const ChartComponent = (props: Props) => {
  const { type = "line", labels, data, height, options } = props
  const { pieBackgroundColors, lineStyle } = props

  /* DOM Size */
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(props.width || 0)
  useEffect(() => {
    const getWidth = (container: HTMLDivElement) => {
      const { width } = container.getBoundingClientRect()
      setWidth(width)
    }

    const container = containerRef.current
    !width && container && getWidth(container)
    // eslint-disable-next-line
  }, [])

  /* Init chart */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chart, setChart] = useState<ChartJS>()
  useEffect(() => {
    const initChart = (ctx: CanvasRenderingContext2D) => {
      ctx.canvas.width = width
      height && (ctx.canvas.height = height)
      const chart = new ChartJS(
        ctx,
        getOptions(type, { pieBackgroundColors, lineStyle })
      )
      setChart(chart)
    }

    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext("2d")
    width && ctx && initChart(ctx)
    // eslint-disable-next-line
  }, [width])

  /* Update chart */
  useEffect(() => {
    const updateChart = (chart: ChartJS) => {
      const merge = (options: ChartJS.ChartOptions) => {
        const getAxe = (axis: string) =>
          path<object>(["scales", `${axis}Axes`, 0])

        const xAxe: ChartXAxe = mergeDeep(
          getAxe("x")(chart.options) || {},
          getAxe("x")(options) || {}
        )

        const yAxe: ChartYAxe = mergeDeep(
          getAxe("y")(chart.options) || {},
          getAxe("y")(options) || {}
        )

        const scales: ChartOptions["scales"] = { xAxes: [xAxe], yAxes: [yAxe] }

        chart.options = mergeDeep(
          chart.options,
          Object.assign({}, options, options.scales && { scales })
        )
      }

      const { datasets } = chart.data
      labels && (chart.data.labels = labels)
      datasets && (datasets[0].data = data)
      options && merge(options)
      lineStyle && datasets && (datasets[0] = { ...datasets[0], ...lineStyle })

      chart.update()
    }

    chart && updateChart(chart)
  }, [chart, labels, data, options, lineStyle])

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  )
}

const Chart = (props: Props) => {
  const [key, setKey] = useState<number>(0)
  useEffect(() => {
    const refresh = debounce(() => setKey((k) => k + 1), 300)
    window.addEventListener("resize", refresh)
    return () => window.removeEventListener("resize", refresh)
  }, [])

  return <ChartComponent {...props} key={key} />
}

export default Chart

/* Chart.js */
const BLUE = "#2043b5"
const getOptions = (
  type: ChartType,
  config: {
    pieBackgroundColors?: string[]
    lineStyle?: ChartJS.ChartDataSets
  }
): ChartJS.ChartConfiguration => {
  /* Dataset Properties */
  const defaultProps = {
    borderWidth: 1,
  }

  const props = {
    doughnut: {
      backgroundColor: [
        "#4c62cd",
        "#5969B9",
        "#8090DC",
        "#99A6E3",
        "#B2BCEA",
        "#CCD2F1",
      ],
    },
    pie: {
      backgroundColor: config.pieBackgroundColors || [
        "#4c62cd",
        "#5969B9",
        "#8090DC",
        "#99A6E3",
        "#B2BCEA",
        "#CCD2F1",
      ],
    },
    line: {
      borderColor: BLUE,
      pointBackgroundColor: BLUE,
      pointRadius: 0,
      pointHoverRadius: 0,
      backgroundColor: "#D9DEF5",
      ...config.lineStyle,
    },
  }[type]

  /* Options */
  const defaultOptions = {
    responsive: true,
    animation: { duration: 0 },
    legend: { display: false },
  }

  const tooltips = {
    backgroundColor: BLUE,
    titleFontFamily: "Gotham",
    titleFontSize: 13,
    titleFontStyle: "700",
    titleMarginBottom: 4,
    bodyFontFamily: "Gotham",
    bodyFontSize: 13,
    bodyFontStyle: "normal",
    xPadding: 15,
    yPadding: 10,
    caretSize: 6,
    displayColors: false,
    callbacks: {
      title: (
        [{ index }]: ChartJS.ChartTooltipItem[],
        { labels }: ChartJS.ChartData
      ) => String(labels && typeof index === "number" && labels[index]),
      label: getLabel,
    },
  }

  const options: ChartOptions = {
    doughnut: {
      aspectRatio: 1,
      cutoutPercentage: 85,
      tooltips,
    },
    pie: {
      aspectRatio: 1,
      cutoutPercentage: 0,
      tooltips,
    },
    line: {
      tooltips: {
        intersect: false,
        mode: "index" as const,
        backgroundColor: BLUE,
        titleFontFamily: "Gotham",
        titleFontSize: 16,
        titleFontStyle: "500",
        titleMarginBottom: 2,
        bodyFontFamily: "Gotham",
        bodyFontSize: 11,
        bodyFontStyle: "normal",
        xPadding: 15,
        yPadding: 10,
        caretSize: 6,
        displayColors: false,
        callbacks: {
          title: ([{ value }]: ChartJS.ChartTooltipItem[]) =>
            `$${formatMoney(Number(value))}`,
          label: getLabel,
        },
      },
      scales: {
        xAxes: [
          {
            type: "time",
            ticks: {
              source: "data" as const,
              autoSkip: true,
              fontColor: "#7282c9",
              fontSize: 11,
            },
            gridLines: { color: "#f0f0f0" },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "#7282c9",
              fontSize: 11,
              callback(value: any) {
                return formatMoney(Number(value))
              },
            },
            gridLines: { color: "#f0f0f0" },
          },
        ],
      },
    },
  }[type]

  return {
    type,
    data: { datasets: [{ ...defaultProps, ...props }] },
    options: Object.assign({}, defaultOptions, options),
  }
}

/* callbacks */
const getLabel = (
  { index }: ChartJS.ChartTooltipItem,
  { datasets }: ChartJS.ChartData
) => {
  type Point = ChartJS.ChartPoint | number
  const point: Point =
    (typeof index === "number" && path([0, "data", index], datasets)) || 0
  const t = point && typeof point !== "number" ? point.t : point
  return t instanceof Date
    ? t.toLocaleDateString()
    : typeof t === "number"
    ? `$${formatMoney(t / 1e6)}`
    : ""
}

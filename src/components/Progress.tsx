import { MouseEvent, ReactNode, useRef, useState } from "react"
import classNames from "classnames/bind"
import { div } from "../libs/math"
import { percent } from "../libs/num"
import styles from "./Progress.module.scss"

const cx = classNames.bind(styles)

interface Item {
  value: string
  label?: string
  color?: "blue" | "red" | "gray"
}

interface Props {
  data: Item[]
  axis?: { x: string; label: ReactNode }[]
  className?: string
  onPosition?: (x: string) => void
  noLabel?: boolean
  compact?: boolean
}

const Progress = ({ data, axis, className, onPosition, ...props }: Props) => {
  const { noLabel, compact } = props
  const componentRef = useRef<HTMLDivElement>(null!)
  const [dragging, setDragging] = useState(false)

  const handlePosition = (e: MouseEvent) => {
    const { left, width } = componentRef.current.getBoundingClientRect()
    const x = div(e.clientX - left, width)
    onPosition?.(x)
  }

  const handleClick = handlePosition
  const handleDrag = (e: MouseEvent) => {
    dragging && handlePosition(e)
  }

  return (
    <div
      className={cx(styles.component, className, {
        cursor: onPosition,
        dragging,
        compact,
      })}
      onClick={handleClick}
      ref={componentRef}
      onMouseMove={handleDrag}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
      {axis && (
        <div className={styles.axis}>
          {axis.map(({ x, label }, index) => {
            const position = index ? styles.right : styles.left
            return (
              <div
                className={classNames(styles.x, axis.length === 2 && position)}
                style={{ left: percent(x) }}
                key={index}
              >
                <span className={styles.text}>{label}</span>
              </div>
            )
          })}
        </div>
      )}

      <div className={styles.track}>
        {data.map(({ value, color }, index) => (
          <div
            className={classNames(styles.item, `bg-${color}`)}
            style={{ width: percent(value) }}
            key={index}
          />
        ))}

        {onPosition && (
          <div
            className={styles.thumb}
            style={{ left: percent(data[0].value) }}
            onMouseDown={() => setDragging(true)}
            onClick={(e) => e.stopPropagation()}
          >
            <Thumb />
          </div>
        )}
      </div>

      {!noLabel && (
        <section className={classNames(styles.feedback, styles.vote)}>
          {data.map(({ value, label, color }, index) => (
            <div
              className={classNames(styles.ratio, color)}
              style={{ marginLeft: percent(value) }}
              key={index}
            >
              <span className={styles.label}>{label}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

export default Progress

/* svg */
const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="8">
    <path
      fill="#141414"
      d="M9.77.5l4.45 2.618v1.765L9.77 7.5V6.03L13.221 4 9.77 1.971V.5zM6.22.5v1.471L2.77 4l3.45 2.029V7.5L1.77 4.882V3.118L6.22.5z"
    />
  </svg>
)

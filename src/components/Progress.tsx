import { MouseEvent, ReactNode, useRef } from "react"
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
  onClick?: (x: string) => void
  noLabel?: boolean
  compact?: boolean
}

const Progress = ({ data, axis, className, onClick, ...props }: Props) => {
  const { noLabel, compact } = props
  const componentRef = useRef<HTMLDivElement>(null!)

  const handleClick = (e: MouseEvent) => {
    const { left, width } = componentRef.current.getBoundingClientRect()
    const x = div(e.clientX - left, width)
    onClick?.(x)
  }

  return (
    <div
      className={cx(styles.component, className, { cursor: onClick, compact })}
      onClick={handleClick}
      ref={componentRef}
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

import { MouseEvent, ReactNode, useRef } from "react"
import classNames from "classnames/bind"
import { div } from "../libs/math"
import { percent } from "../libs/num"
import styles from "./Progress.module.scss"

const cx = classNames.bind(styles)

interface Item {
  value: string
  label?: string
  color?: "blue" | "orange" | "red"
}

interface Props {
  data: Item[]
  axis?: { x: string; label: ReactNode }[]
  className?: string
  onClick?: (x: string) => void
  noLabel?: boolean
}

const Progress = ({ data, axis, className, onClick, noLabel }: Props) => {
  const componentRef = useRef<HTMLDivElement>(null!)

  const handleClick = (e: MouseEvent) => {
    const { left, width } = componentRef.current.getBoundingClientRect()
    const x = div(e.clientX - left, width)
    onClick?.(x)
  }

  return (
    <div
      className={cx(styles.component, className, { cursor: onClick })}
      onClick={handleClick}
      ref={componentRef}
    >
      {axis && (
        <div className={styles.axis}>
          {axis.map(({ x, label }, index) => (
            <div className={styles.x} style={{ left: percent(x) }} key={index}>
              {label}
            </div>
          ))}
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

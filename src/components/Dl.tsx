import React, { Fragment } from "react"
import classNames from "classnames/bind"
import styles from "./Dl.module.scss"

const cx = classNames.bind(styles)

interface Options {
  fontSize?: number
  type?: "horizontal" | "vertical"
  align?: "left" | "center"
  className?: string
  ddClassName?: string
}

type Di = Content & Options
export const Di = ({ title, content, ...options }: Di) => (
  <Dl {...options} list={[{ title, content }]} />
)

interface Props extends Options {
  list: Content[]
}

const Dl = ({ list, fontSize, ...props }: Props) => {
  const { type = "horizontal", align = "left", className, ddClassName } = props
  const style =
    align === "center" ? { textAlign: align, justifyContent: "center" } : {}

  return (
    <dl className={cx(styles.dl, type, className)} style={style}>
      {list.map(({ title, content }, index) => (
        <Fragment key={index}>
          <dt className={styles.dt}>{title}</dt>
          <dd
            className={classNames(styles.dd, ddClassName)}
            style={{ fontSize }}
          >
            {content}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}

interface DlFooter extends Props {
  className?: string
  margin?: boolean
}

export const DlFooter = ({ list, className, margin, ...options }: DlFooter) => (
  <footer className={cx(styles.footer, { margin }, className)}>
    {list.map((content, index) => (
      <article className={styles.item} key={index}>
        <Di {...content} type="vertical" align="center" {...options} />
      </article>
    ))}
  </footer>
)

export default Dl

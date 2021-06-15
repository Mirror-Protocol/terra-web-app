import { FC } from "react"
import classNames from "classnames/bind"
import LoadingTitle from "./LoadingTitle"
import { Props } from "./Card"
import styles from "./CardHeader.module.scss"

const cx = classNames.bind(styles)

enum HeaderType {
  /** (align:left) title + description + loading + action */
  DEFAULT,
  /** (align:center) */
  ICON,
}

const CardHeader: FC<Props> = ({ header, title, ...props }) => {
  const { icon, description, action, loading, center } = props

  const headerType = icon ? HeaderType.ICON : HeaderType.DEFAULT

  const className = {
    [HeaderType.DEFAULT]: styles.default,
    [HeaderType.ICON]: styles.icon,
  }[headerType]

  const render = {
    [HeaderType.DEFAULT]: (
      <>
        <section className={cx(styles.wrapper, { center })}>
          {typeof loading === "boolean" ? (
            <LoadingTitle loading={loading} size={16}>
              <h1 className={styles.title}>{title}</h1>
            </LoadingTitle>
          ) : (
            <h1 className={styles.title}>{title}</h1>
          )}

          {description && (
            <section className={styles.description}>{description}</section>
          )}
        </section>

        {action && <section className={styles.action}>{action}</section>}
      </>
    ),

    [HeaderType.ICON]: (
      <>
        <section className={styles.wrapper}>{icon}</section>
        <h1 className={styles.title}>{title}</h1>
      </>
    ),
  }[headerType]

  return !(header || title) ? null : (
    <header className={classNames(styles.header, className)}>
      {header ?? render}
    </header>
  )
}

export default CardHeader

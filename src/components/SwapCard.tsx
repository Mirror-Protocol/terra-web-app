import { FC, PropsWithChildren, ReactNode } from "react"
import { Link } from "react-router-dom"
import classNames from "classnames/bind"
import styles from "./SwapCard.module.scss"

const cx = classNames.bind(styles)

export interface Props {
  /** Icon above title */
  icon?: ReactNode
  header?: ReactNode
  title?: ReactNode
  description?: ReactNode

  /** Card acts as a link */
  to?: string
  /** Button to the left of the title */
  goBack?: () => void
  /** Button to the right of the title */
  action?: ReactNode

  /** Card class */
  className?: string
  /** More padding and more rounded corners */
  lg?: boolean
  /** No padding */
  full?: boolean
  /** Box shadow */
  shadow?: boolean
  /** Show loading indicator to the right of title */
  loading?: boolean
  logoTitle?: string
}

const SwapCard: FC<PropsWithChildren<Props>> = (props) => {
  const { title, children, to, logoTitle, className, lg, full, shadow } = props

  const attrs = {
    className: cx(styles.card, { lg, full, link: to, shadow }, className),
    children: (
      <>
        <p className={styles.header}>
          {title ? (
            title
          ) : !logoTitle ? (
            <span>
              <span className={styles.normal}>Swap</span>
            </span>
          ) : (
            <span>{logoTitle}</span>
          )}
        </p>
        <section className={styles.main}>{children}</section>
      </>
    ),
  }

  return to ? <Link {...attrs} to={to} /> : <div {...attrs} />
}

export default SwapCard

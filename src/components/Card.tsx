import { FC, ReactNode } from "react"
import { Link } from "react-router-dom"
import classNames from "classnames/bind"
import CardHeader from "./CardHeader"
import styles from "./Card.module.scss"

const cx = classNames.bind(styles)

interface CardMainProps {
  className?: string
  full?: boolean
}

export const CardMain: FC<CardMainProps> = ({ full, children, className }) => (
  <section className={cx(styles.main, { full }, className)}>{children}</section>
)

const CardConfirm: FC = ({ children }) => (
  <div className={styles.confirm}>
    <CardMain>{children}</CardMain>
  </div>
)

export interface Props {
  /** Icon above title */
  icon?: ReactNode
  header?: ReactNode
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  confirm?: ReactNode

  /** Card acts as a link */
  to?: string
  /** Button to the right of the title */
  action?: ReactNode
  /** Badges */
  badges?: Badge[]

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
  /** Center title */
  center?: boolean
}

interface Badge {
  label: string
  color: string
}

const Card: FC<Props> = (props) => {
  const { children, footer, confirm, to, className, lg, full, shadow } = props

  const content = (
    <>
      <CardHeader {...props} />
      {full ? children : children && <CardMain>{children}</CardMain>}
      {confirm && <CardConfirm>{confirm}</CardConfirm>}
    </>
  )

  const attrs = {
    className: cx(
      styles.card,
      { lg, full, link: to, shadow, flex: footer },
      className
    ),

    children: footer ? (
      <>
        <div>{content}</div>
        {footer}
      </>
    ) : (
      content
    ),
  }

  return to ? <Link {...attrs} to={to} /> : <div {...attrs} />
}

export default Card

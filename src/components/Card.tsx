import { FC, ReactNode } from "react"
import { Link } from "react-router-dom"
import classNames from "classnames/bind"
import CardHeader from "./CardHeader"
import styles from "./Card.module.scss"

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
}

interface Badge {
  label: string
  color: string
}

const Card: FC<Props> = (props) => {
  const { children, to, badges, className, lg, full, shadow } = props

  const attrs = {
    className: cx(styles.card, { lg, full, link: to, shadow }, className),
    children: (
      <>
        <CardHeader {...props} />

        {badges && (
          <section className={styles.badges}>
            {badges.map(({ label, color }) => (
              <span className={cx(styles.badge, `bg-${color}`)} key={label}>
                {label}
              </span>
            ))}
          </section>
        )}

        <section className={styles.main}>{children}</section>
      </>
    ),
  }

  return to ? <Link {...attrs} to={to} /> : <div {...attrs} />
}

export default Card

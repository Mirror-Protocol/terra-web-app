import { FC, ReactNode } from "react"
import { Link } from "react-router-dom"
import classNames from "classnames"
import { LocationDescriptor } from "history"
import LoadingTitle from "./LoadingTitle"
import Icon from "./Icon"
import styles from "./Caption.module.scss"

interface ActionProps {
  className?: string
  to?: LocationDescriptor
}

export const CaptionAction: FC<ActionProps> = ({ className, to, children }) => {
  const attrs = {
    className: classNames(styles.button, className),
    children: (
      <>
        {children}
        <Icon name="ChevronRight" size={8} />
      </>
    ),
  }

  return to ? <Link to={to} {...attrs} /> : <span {...attrs} />
}

interface Props {
  title: ReactNode
  description?: ReactNode
  loading?: boolean
}

const Caption = ({ title, description, loading }: Props) => {
  return (
    <div className={styles.component}>
      <LoadingTitle loading={loading} size={16}>
        {title}
      </LoadingTitle>

      <section className={styles.desc}>{description}</section>
    </div>
  )
}

export default Caption

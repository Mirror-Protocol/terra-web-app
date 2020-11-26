import { FC } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames"
import Card from "./Card"
import { TooltipIcon } from "./Tooltip"
import styles from "./Tab.module.scss"

const Tab: FC<Tab> = ({ tabs, tooltips, current, shadow, children }) => {
  const { search, state } = useLocation()

  return !current ? null : (
    <Card full shadow={shadow}>
      <section className={styles.tabs}>
        {tabs.map((tab, index) => {
          const to = { hash: tab, search, state }
          const tooltip = tooltips?.[index]
          const label = tooltip ? (
            <TooltipIcon content={tooltip}>{tab}</TooltipIcon>
          ) : (
            tab
          )

          return tab === current ? (
            <span className={classNames(styles.tab, styles.active)} key={tab}>
              {label}
            </span>
          ) : (
            <Link replace to={to} className={styles.tab} key={tab}>
              {label}
            </Link>
          )
        })}
      </section>

      <section className={styles.content}>{children}</section>
    </Card>
  )
}

export default Tab

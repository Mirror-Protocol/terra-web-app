import React, { FC } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames"
import Card from "./Card"
import styles from "./Tab.module.scss"

const Tab: FC<Tab> = ({ tabs, current, shadow, children }) => {
  const { search, state } = useLocation()

  return !current ? null : (
    <Card full shadow={shadow}>
      <section className={styles.tabs}>
        {tabs.map((tab: string) => {
          const to = { hash: tab, search, state }
          return tab === current ? (
            <span className={classNames(styles.tab, styles.active)} key={tab}>
              {tab}
            </span>
          ) : (
            <Link replace to={to} className={styles.tab} key={tab}>
              {tab}
            </Link>
          )
        })}
      </section>

      <section className={styles.content}>{children}</section>
    </Card>
  )
}

export default Tab

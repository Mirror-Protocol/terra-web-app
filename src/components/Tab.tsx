import { FC } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames/bind"
import { capitalize } from "../libs/utils"
import { TooltipIcon } from "./Tooltip"
import Boundary from "./Boundary"
import styles from "./Tab.module.scss"

const cx = classNames.bind(styles)

const Tab: FC<Tab> = ({ tabs, tooltips, current, onClick, children }) => {
  const { search, state } = useLocation()

  return !current ? null : (
    <>
      <div className={styles.wrapper}>
        <section className={styles.tabs}>
          {tabs.map((tab, index) => {
            const to = { hash: tab, search, state }
            const tooltip = tooltips?.[index]
            const label = tooltip ? (
              <TooltipIcon content={tooltip}>{capitalize(tab)}</TooltipIcon>
            ) : (
              capitalize(tab)
            )

            const attrs = {
              className: cx(styles.tab, { active: tab === current }),
              key: tab,
              children: label,
            }

            return onClick ? (
              <button {...attrs} onClick={() => onClick(tab)} />
            ) : tab === current ? (
              <span {...attrs} />
            ) : (
              <Link {...attrs} replace to={to} />
            )
          })}
        </section>
      </div>

      <Boundary>{children}</Boundary>
    </>
  )
}

export default Tab

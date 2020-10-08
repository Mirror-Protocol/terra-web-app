import React from "react"
import { NavLink } from "react-router-dom"
import classNames from "classnames"
import { MenuKey, getPath, omit } from "../routes"
import styles from "./Menu.module.scss"

const Header = () => {
  const list = Object.values(MenuKey).filter((key) => !omit.includes(key))

  return (
    <ul className={styles.menu}>
      {list.map((key: MenuKey) => {
        const desktop = key === MenuKey.MY

        return (
          <li className={classNames(styles.item, { desktop })} key={key}>
            <NavLink
              to={getPath(key)}
              className={styles.link}
              activeClassName={styles.active}
            >
              {key}
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}

export default Header

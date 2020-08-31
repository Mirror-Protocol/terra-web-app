import { NavLink } from "react-router-dom"
import classNames from "classnames"
import styles from "./Menu.module.scss"

const Menu = ({ list }: { list: MenuItem[] }) => {
  return (
    <ul className={styles.menu}>
      {list.map(({ attrs, desktopOnly }) => {
        return (
          <li
            className={classNames(styles.item, { desktop: desktopOnly })}
            key={attrs.children}
          >
            <NavLink
              {...attrs}
              exact={attrs.to === "/"}
              className={styles.link}
              activeClassName={styles.active}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default Menu

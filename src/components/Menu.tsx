import { NavLink } from "react-router-dom"
import classNames from "classnames"
import styles from "./Menu.module.scss"
import Icon from "./Icon"

interface MenuItem {
  icon: IconNames
  attrs: { to: string; children: string }
  desktopOnly?: boolean
}

const Menu = ({ list }: { list: MenuItem[] }) => {
  return (
    <ul className={styles.menu}>
      {list.map(({ icon, attrs, desktopOnly }) => {
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
            >
              <div className={styles.wrapper}>
                <Icon name={icon} className={styles.icon} />
                {attrs.children}
              </div>
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}

export default Menu

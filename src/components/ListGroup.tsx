import { useState } from "react"
import { NavLink } from "react-router-dom"
import classNames from "classnames/bind"
import useHash from "../libs/useHash"
import { Group } from "./List"
import Icon from "./Icon"
import styles from "./ListGroup.module.scss"

const cx = classNames.bind(styles)

interface Props extends Group {
  initial: boolean
}

const ListGroup = ({ title, items, initial }: Props) => {
  const { hash } = useHash()
  const [isOpen, setIsOpen] = useState(initial)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <>
      <header
        className={cx(styles.header, { collapsed: !isOpen })}
        onClick={toggle}
      >
        <h1>{title}</h1>
        <Icon name={isOpen ? "ChevronUpThin" : "ChevronDownThin"} size={12} />
      </header>

      {isOpen && (
        <ul>
          {items.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                className={styles.link}
                activeClassName={styles.active}
                isActive={() => hash === to.hash}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default ListGroup

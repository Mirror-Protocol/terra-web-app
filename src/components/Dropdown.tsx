import { FC, ReactNode } from "react"
import classNames from "classnames/bind"
import styles from "./Dropdown.module.scss"

const cx = classNames.bind(styles)

const Dropdown: FC<{ list?: ReactNode[] }> = ({ list, children }) => {
  const renderItem = (item: ReactNode, index: number) => (
    <li className={styles.item} key={index}>
      {item}
    </li>
  )

  return (
    <ul className={cx(styles.dropdown, { list })}>
      {list?.map(renderItem) ?? children}
    </ul>
  )
}

export default Dropdown

import { ReactNode } from "react"
import styles from "./Dropdown.module.scss"

const Dropdown = ({ list }: { list: ReactNode[] }) => {
  const renderItem = (item: ReactNode, index: number) => (
    <li className={styles.item} key={index}>
      {item}
    </li>
  )

  return <ul className={styles.dropdown}>{list.map(renderItem)}</ul>
}

export default Dropdown

import { LocationDescriptorObject } from "history"
import ListGroup from "./ListGroup"
import styles from "./List.module.scss"

export interface Group {
  title: string
  items: Item[]
}

export interface Item {
  to: LocationDescriptorObject
  label: string
}

const List = ({ groups }: { groups: Group[] }) => {
  return (
    <div className={styles.component}>
      {groups.map((group, index) => (
        <ListGroup {...group} initial={!index} key={group.title} />
      ))}
    </div>
  )
}

export default List

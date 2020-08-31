import { ReactNode } from "react"
import Card from "./Card"
import styles from "./ListCard.module.scss"

const ListCard = ({ list }: { list: ReactNode[] }) => (
  <Card full>
    <ul>
      {list.map((item, index) => (
        <li className={styles.item} key={index}>
          {item}
        </li>
      ))}
    </ul>
  </Card>
)

export default ListCard

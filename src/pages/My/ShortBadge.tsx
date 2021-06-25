import Badge from "../../components/Badge"
import styles from "./ShortBadge.module.scss"

const ShortBadge = () => {
  return (
    <Badge className={styles.badge} bg="blue">
      Short
    </Badge>
  )
}

export default ShortBadge

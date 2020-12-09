import { FC } from "react"
import Icon from "./Icon"
import styles from "./Alert.module.scss"

interface Props {
  isOpen: boolean
  onClose: () => void
}

const Alert: FC<Props> = ({ isOpen, onClose, children }) =>
  !isOpen ? null : (
    <div className={styles.component}>
      <section className={styles.main}>
        <Icon name="info" size={16} />
        {children}
      </section>

      <button className={styles.close} onClick={onClose}>
        <Icon name="close" size={16} />
      </button>
    </div>
  )

export default Alert

import { FC, useState } from "react"
import Icon from "./Icon"
import styles from "./Alert.module.scss"

const Alert: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)
  const close = () => setIsOpen(false)

  return !isOpen ? null : (
    <div className={styles.component}>
      <section className={styles.main}>
        <Icon name="info" size={16} />
        {children}
      </section>

      <button className={styles.close} onClick={close}>
        <Icon name="close" size={16} />
      </button>
    </div>
  )
}

export default Alert

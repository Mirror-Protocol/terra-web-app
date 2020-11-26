import { FC } from "react"
import Icon from "../components/Icon"
import styles from "./FormFeedback.module.scss"

const FormFeedback: FC = ({ children }) => (
  <div className={styles.component}>
    <Icon name="warning" size={16} className={styles.icon} />
    <p>{children}</p>
  </div>
)

export default FormFeedback

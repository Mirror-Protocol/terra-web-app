import Icon from "../components/Icon"
import styles from "./FormIcon.module.scss"

const FormIcon = ({ name }: { name: string }) => (
  <div className={styles.wrapper}>
    <Icon name={name} size={24} />
  </div>
)

export default FormIcon

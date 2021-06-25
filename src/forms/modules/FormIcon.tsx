import Icon from "../../components/Icon"
import styles from "./FormIcon.module.scss"

const FormIcon = ({ name }: { name: IconNames }) => (
  <div className={styles.wrapper}>
    <Icon name={name} size={20} />
  </div>
)

export default FormIcon

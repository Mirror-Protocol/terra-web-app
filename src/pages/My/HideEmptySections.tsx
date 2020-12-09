import Checkbox from "../../components/Checkbox"
import styles from "./HideEmptySections.module.scss"

interface Props {
  hide: boolean
  toggle: () => void
}

const HideEmptySections = ({ hide, toggle }: Props) => (
  <button type="button" onClick={toggle}>
    <Checkbox checked={hide} className={styles.hide}>
      Hide empty sections
    </Checkbox>
  </button>
)

export default HideEmptySections

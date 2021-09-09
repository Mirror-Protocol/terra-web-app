import { INSURANCE_COVERAGE } from "../../constants"
import ExtLink from "../../components/ExtLink"
import Icon from "../../components/Icon"
import styles from "./InsuaranceCoverageLink.module.scss"

const InsuaranceCoverageLink = () => (
  <ExtLink href={INSURANCE_COVERAGE} className={styles.link}>
    <Icon name="Guard" />
    Get Coverage
  </ExtLink>
)

export default InsuaranceCoverageLink

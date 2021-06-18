import Grid from "../../components/Grid"
import styles from "./GovHomeHeader.module.scss"
import GovInfo from "./GovInfo"
import GovStakeInfo from "./GovStakeInfo"

const GovHomeHeader = () => {
  return (
    <Grid>
      <div className={styles.lg}>
        <GovInfo />
      </div>

      <div className={styles.sm}>
        <GovStakeInfo />
      </div>
    </Grid>
  )
}

export default GovHomeHeader

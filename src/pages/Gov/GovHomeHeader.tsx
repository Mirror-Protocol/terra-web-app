import Grid from "../../components/Grid"
import GovInfo from "./GovInfo"
import GovStakeInfo from "./GovStakeInfo"
import styles from "./GovHomeHeader.module.scss"

const GovHomeHeader = () => {
  return (
    <Grid className={styles.grid}>
      <GovInfo />
      <GovStakeInfo />
    </Grid>
  )
}

export default GovHomeHeader

import { useAddress } from "../../hooks"
import { bound } from "../../components/Boundary"
import Grid from "../../components/Grid"
import GovInfo from "./GovInfo"
import GovStakeInfo from "./GovStakeInfo"
import styles from "./GovHomeHeader.module.scss"

const GovHomeHeader = () => {
  const address = useAddress()

  return (
    <Grid className={styles.grid}>
      <GovInfo />
      {address && bound(<GovStakeInfo />)}
    </Grid>
  )
}

export default GovHomeHeader

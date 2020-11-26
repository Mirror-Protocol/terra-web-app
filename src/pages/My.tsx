import Page from "../components/Page"
import { MenuKey } from "../routes"
import Holdings from "./My/Holdings"
import Mint from "./My/Mint"
import Pool from "./My/Pool"
import Stake from "./My/Stake"
import ConnectionRequired from "../components/ConnectionRequired"
import { useWallet } from "../hooks"
import Grid from "../components/Grid"

const My = () => {
  const { address } = useWallet()

  return (
    <Page title={MenuKey.MY} noBreak>
      {!address ? (
        <ConnectionRequired />
      ) : (
        <>
          <Grid>
            <Holdings />
          </Grid>

          <Grid>
            <Mint />
          </Grid>

          <Grid>
            <Pool />
          </Grid>

          <Grid>
            <Stake />
          </Grid>
        </>
      )}
    </Page>
  )
}

export default My

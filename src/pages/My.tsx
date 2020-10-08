import React from "react"
import Page from "../components/Page"
import { MenuKey } from "../routes"
import Investment from "./My/Investment"
import Minted from "./My/Minted"
import Staked from "./My/Staked"
// import History from "./My/History"
import ConnectionRequired from "../components/ConnectionRequired"
import { useWallet } from "../hooks"
import Grid from "../components/Grid"

const My = () => {
  const { address } = useWallet()

  return (
    <Page title={MenuKey.MY}>
      {!address ? (
        <ConnectionRequired />
      ) : (
        <>
          <Grid>
            <Investment />
          </Grid>

          <Grid>
            <Minted />
          </Grid>

          <Grid>
            <Staked />
          </Grid>

          {/* <Grid>
            <History />
          </Grid> */}
        </>
      )}
    </Page>
  )
}

export default My

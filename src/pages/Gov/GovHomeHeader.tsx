import React from "react"
import { MIR } from "../../constants"
import { useGov } from "../../graphql/useGov"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import CountWithResult from "../../components/CountWithResult"
import MIRSupplyCard from "../Stake/MIRSupplyCard"
import GovMIR from "./GovMIR"
import styles from "./GovHomeHeader.module.scss"

const GovHomeHeader = () => {
  const { result, state } = useGov()

  return (
    <Grid>
      <div className={styles.sm}>
        <Grid>
          <MIRSupplyCard />
        </Grid>

        <Grid>
          <Card>
            <Summary title={`Total Staked ${MIR}`}>
              <CountWithResult result={result.state} symbol={MIR} integer>
                {state?.total_share}
              </CountWithResult>
            </Summary>
          </Card>
        </Grid>
      </div>

      <div className={styles.lg}>
        <Card>
          <GovMIR />
        </Card>
      </div>
    </Grid>
  )
}

export default GovHomeHeader

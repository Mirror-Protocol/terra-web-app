import React from "react"
import { MIR } from "../../constants"
import { minus } from "../../libs/math"
import { GovKey, useGov, useRefetchGov } from "../../graphql/useGov"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import CountWithResult from "../../components/CountWithResult"
import MIRSupplyCard from "../Stake/MIRSupplyCard"
import GovMIR from "./GovMIR"
import styles from "./GovHomeHeader.module.scss"

const GovHomeHeader = () => {
  const { result, balance, state } = useGov()
  useRefetchGov([GovKey.BALANCE, GovKey.STATE])

  return (
    <Grid>
      <div className={styles.sm}>
        <Grid>
          <MIRSupplyCard />
        </Grid>

        <Grid>
          <Card>
            <Summary title={`Total Staked ${MIR}`}>
              <CountWithResult results={[result.state]} symbol={MIR} integer>
                {minus(balance, state?.total_deposit)}
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

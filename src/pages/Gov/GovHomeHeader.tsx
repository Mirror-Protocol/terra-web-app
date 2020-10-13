import React from "react"
import { MIR } from "../../constants"
import { div, minus, isFinite } from "../../libs/math"
import { percent } from "../../libs/num"
import { GovKey, useGov, useRefetchGov } from "../../graphql/useGov"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import CountWithResult from "../../components/CountWithResult"
import { useMirrorTokenInfo } from "../Stake/MIRSupplyCard"
import GovMIR from "./GovMIR"
import styles from "./GovHomeHeader.module.scss"

const GovHomeHeader = () => {
  useRefetchGov([GovKey.BALANCE, GovKey.STATE])
  const { result, balance, state } = useGov()
  const supply = useMirrorTokenInfo()

  const totalStaked = [balance, state?.total_deposit].every(isFinite)
    ? minus(balance, state?.total_deposit)
    : "0"

  const totalStakedRatio = [totalStaked, supply.value].every(isFinite)
    ? div(totalStaked, supply.value)
    : "0"

  return (
    <Grid>
      <div className={styles.sm}>
        <Grid>
          <Card>
            <Summary title="Total Staked">
              <CountWithResult results={[result.state]} symbol={MIR} integer>
                {totalStaked}
              </CountWithResult>
            </Summary>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <Summary title="Staking Ratio">
              <CountWithResult results={[supply.result]} format={percent}>
                {totalStakedRatio}
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

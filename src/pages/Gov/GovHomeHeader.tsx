import Tooltip from "../../lang/Tooltip.json"
import { MIR } from "../../constants"
import { div, minus, isFinite } from "../../libs/math"
import { percent } from "../../libs/num"
import { GovKey } from "../../graphql/useGov"
import { useGov, useGovState, useRefetchGov } from "../../graphql/useGov"
import useDashboard from "../../statistics/useDashboard"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import { TooltipIcon } from "../../components/Tooltip"
import Count from "../../components/Count"
import CountWithResult from "../../containers/CountWithResult"
import GovMIR from "./GovMIR"
import styles from "./GovHomeHeader.module.scss"

const GovHomeHeader = () => {
  useRefetchGov([GovKey.BALANCE])
  const state = useGovState()
  const { balance } = useGov()
  const dashboard = useDashboard()
  const supply = dashboard.dashboard?.mirCirculatingSupply

  const totalStaked = [balance, state?.total_deposit].every(isFinite)
    ? minus(balance, state?.total_deposit)
    : "0"

  const totalStakedRatio = [totalStaked, supply].every(isFinite)
    ? div(totalStaked, supply)
    : "0"

  return (
    <Grid>
      <div className={styles.sm}>
        <Grid>
          <Card>
            <Summary
              title={
                <TooltipIcon content={Tooltip.Gov.TotalStaked}>
                  Total Staked
                </TooltipIcon>
              }
            >
              <Count symbol={MIR} integer>
                {totalStaked}
              </Count>
            </Summary>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <Summary
              title={
                <TooltipIcon content={Tooltip.Gov.StakingRatio}>
                  Staking Ratio
                </TooltipIcon>
              }
            >
              <CountWithResult results={[dashboard]} format={percent}>
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

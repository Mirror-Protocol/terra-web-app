import Tooltip from "../../lang/Tooltip.json"
import { div, minus, isFinite } from "../../libs/math"
import { percent } from "../../libs/num"
import { useDashboard } from "../../data/stats/statistic"
import { useGovState } from "../../data/gov/state"
import { mirrorTokenGovBalanceQuery } from "../../data/contract/info"

import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import { TooltipIcon } from "../../components/Tooltip"
import Count from "../../components/Count"
import GovMIR from "./GovMIR"
import styles from "./GovHomeHeader.module.scss"
import { useRecoilValue } from "recoil"

const GovHomeHeader = () => {
  const state = useGovState()
  const balance = useRecoilValue(mirrorTokenGovBalanceQuery)
  const { mirSupply } = useDashboard()
  const supply = mirSupply.circulating

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
              <Count symbol="MIR" integer>
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
              <Count format={percent}>{totalStakedRatio}</Count>
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

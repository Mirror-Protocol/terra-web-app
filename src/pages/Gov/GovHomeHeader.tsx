import { useRecoilValue } from "recoil"

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
import { bound } from "../../components/Boundary"
import GovMIR from "./GovMIR"
import styles from "./GovHomeHeader.module.scss"

const TotalStaked = () => {
  const totalStaked = useTotalStaked()

  return (
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
  )
}

const StakingRatio = () => {
  const totalStaked = useTotalStaked()
  const { mirSupply } = useDashboard()
  const supply = mirSupply.circulating

  const totalStakedRatio = [totalStaked, supply].every(isFinite)
    ? div(totalStaked, supply)
    : "0"

  return (
    <Summary
      title={
        <TooltipIcon content={Tooltip.Gov.StakingRatio}>
          Staking Ratio
        </TooltipIcon>
      }
    >
      <Count format={percent}>{totalStakedRatio}</Count>
    </Summary>
  )
}

const GovHomeHeader = () => {
  return (
    <Grid>
      <div className={styles.sm}>
        <Grid>
          <Card>{bound(<TotalStaked />)}</Card>
        </Grid>

        <Grid>
          <Card>{bound(<StakingRatio />)}</Card>
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

/* hook */
const useTotalStaked = () => {
  const state = useGovState()
  const balance = useRecoilValue(mirrorTokenGovBalanceQuery)

  return [balance, state?.total_deposit].every(isFinite)
    ? minus(balance, state?.total_deposit)
    : "0"
}

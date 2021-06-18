import Tooltips from "../../lang/Tooltips"
import { div, isFinite } from "../../libs/math"
import { percent } from "../../libs/num"
import { useDashboard } from "../../data/stats/statistic"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import { TooltipIcon } from "../../components/Tooltip"
import { useTotalStaked } from "./useTotalStaked"

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
        <TooltipIcon content={Tooltips.Gov.StakingRatio}>
          Staking Ratio
        </TooltipIcon>
      }
    >
      <Count format={percent}>{totalStakedRatio}</Count>
    </Summary>
  )
}

export default StakingRatio

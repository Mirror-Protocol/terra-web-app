import Tooltips from "../../lang/Tooltips"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import { TooltipIcon } from "../../components/Tooltip"
import { useTotalStaked } from "./useTotalStaked"

const TotalStaked = () => {
  const totalStaked = useTotalStaked()

  return (
    <Summary
      title={
        <TooltipIcon content={Tooltips.Gov.TotalStaked}>
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

export default TotalStaked

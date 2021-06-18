import Tooltips from "../../lang/Tooltips"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import { useTotalStaked } from "./useTotalStaked"

const TotalStaked = () => {
  const totalStaked = useTotalStaked()

  return (
    <Summary title="Total Staked" tooltip={Tooltips.Gov.TotalStaked} size="sm">
      <Count symbol="MIR" integer>
        {totalStaked}
      </Count>
    </Summary>
  )
}

export default TotalStaked

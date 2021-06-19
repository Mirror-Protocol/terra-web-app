import Tooltips from "../../lang/Tooltips"
import Summary from "../../components/Summary"
import Formatted from "../../components/Formatted"
import { useTotalStaked } from "./useTotalStaked"

const TotalStaked = () => {
  const totalStaked = useTotalStaked()

  return (
    <Summary title="Total Staked" tooltip={Tooltips.Gov.TotalStaked} size="sm">
      <Formatted symbol="MIR" integer>
        {totalStaked}
      </Formatted>
    </Summary>
  )
}

export default TotalStaked

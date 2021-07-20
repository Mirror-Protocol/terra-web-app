import Tooltips from "../../lang/Tooltips"
import { useTotalStaked } from "../../data/gov/store"
import Summary from "../../components/Summary"
import Formatted from "../../components/Formatted"

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

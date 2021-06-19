import Tooltips from "../../lang/Tooltips"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import useCommunityBalance from "../Dashboard/useCommunityBalance"

const CommunityBalance = () => {
  const balance = useCommunityBalance()

  return (
    <Summary
      title="Community Pool"
      tooltip={Tooltips.Gov.CommunityPoolBalance}
      size="sm"
    >
      <Count symbol="MIR" integer>
        {balance}
      </Count>
    </Summary>
  )
}

export default CommunityBalance

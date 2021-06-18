import Summary from "../../components/Summary"
import Count from "../../components/Count"
import useCommunityBalance from "../Dashboard/useCommunityBalance"

const CommunityBalance = () => {
  const balance = useCommunityBalance()

  return (
    <Summary title="Community Pool">
      <Count symbol="MIR" integer>
        {balance}
      </Count>
    </Summary>
  )
}

export default CommunityBalance

import Tooltips from "../../lang/Tooltips"
import { useDashboard } from "../../data/stats/statistic"
import Summary from "../../components/Summary"
import Percent from "../../components/Percent"

const GovAPR = () => {
  const { govAPR } = useDashboard()

  return (
    <Summary title="APR" tooltip={Tooltips.Gov.APR} size="lg">
      <Percent>{govAPR}</Percent>
    </Summary>
  )
}

export default GovAPR

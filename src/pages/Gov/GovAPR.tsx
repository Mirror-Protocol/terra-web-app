import Tooltips from "../../lang/Tooltips"
import { useDashboard } from "../../data/stats/statistic"
import Summary from "../../components/Summary"
import Percent from "../../components/Percent"
import { TooltipIcon } from "../../components/Tooltip"

const GovAPR = () => {
  const { govAPR } = useDashboard()

  return (
    <Summary title={<TooltipIcon content={Tooltips.Gov.APR}>APR</TooltipIcon>}>
      <Percent>{govAPR}</Percent>
    </Summary>
  )
}

export default GovAPR

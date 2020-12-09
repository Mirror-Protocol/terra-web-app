import { UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { gt } from "../../libs/math"
import { Di } from "../../components/Dl"
import Count from "../../components/Count"
import { TooltipIcon } from "../../components/Tooltip"

interface Props {
  value: string
  loading: boolean
}

const TotalValue = ({ value, loading }: Props) => (
  <Di
    title="Total Value"
    content={
      <TooltipIcon content={Tooltip.My.TotalValue}>
        <Count symbol={UUSD}>{loading && gt(value, 0) ? "0" : value}</Count>
      </TooltipIcon>
    }
  />
)

export default TotalValue

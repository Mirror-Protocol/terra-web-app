import Tooltip from "../../lang/Tooltip.json"
import { TooltipIcon } from "../../components/Tooltip"

const StakeListTitle = () => {
  const tooltip = (
    <section>
      <article>
        <p>{Tooltip.Stake.Title}</p>
      </article>

      <article>
        <h1>APR</h1>
        <p>{Tooltip.Stake.APR}</p>
      </article>

      <article>
        <h1>Total Staked</h1>
        <p>{Tooltip.Stake.TotalStaked}</p>
      </article>
    </section>
  )

  return (
    <TooltipIcon content={tooltip}>
      <p>Earn MIR tokens by staking LP Tokens!</p>
    </TooltipIcon>
  )
}

export default StakeListTitle

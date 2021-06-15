import { useRouteMatch } from "react-router-dom"
import Tooltip from "../../lang/Tooltip.json"
import { ReactComponent as Logo } from "../../styles/images/MIR.svg"
import { percent } from "../../libs/num"
import { useAddress } from "../../hooks"
import { useDashboard } from "../../data/stats/statistic"
import Count from "../../components/Count"
import LinkButton from "../../components/LinkButton"
import { TooltipIcon } from "../../components/Tooltip"
import GovMIRFooter from "./GovMIRFooter"
import styles from "./GovMIR.module.scss"

const GovMIR = () => {
  const address = useAddress()

  /* apr */
  const dashboard = useDashboard()

  /* link */
  const { url } = useRouteMatch()
  const stake = { to: url + "/stake", className: styles.button }

  return (
    <article className={styles.component}>
      <div className={styles.logo}>
        <Logo height={24} />
      </div>

      <h1 className={styles.title}>Mirror (MIR)</h1>

      <section>
        <span className={styles.apr}>
          <Count format={percent}>{dashboard?.govAPR}</Count>
        </span>

        <section className={styles.desc}>
          <TooltipIcon content={Tooltip.Gov.APR}>
            Annual percentage rate (APR)
          </TooltipIcon>
          <p>(if voted to all polls)</p>
        </section>
      </section>

      <LinkButton {...stake} size="sm" outline>
        Stake
      </LinkButton>

      {address && <GovMIRFooter />}
    </article>
  )
}

export default GovMIR

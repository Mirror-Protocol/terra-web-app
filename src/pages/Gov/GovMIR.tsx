import React from "react"
import { useRouteMatch } from "react-router-dom"
import { MIR } from "../../constants"
import { ReactComponent as Logo } from "../../images/MIR.svg"
import { percent } from "../../libs/num"
import { useWallet } from "../../hooks"
import Count from "../../components/Count"
import LinkButton from "../../components/LinkButton"
import GovMIRFooter from "./GovMIRFooter"
import styles from "./GovMIR.module.scss"
import useDashboard from "../../statistics/useDashboard"

const GovMIR = () => {
  const { address } = useWallet()

  /* apr */
  const { dashboard } = useDashboard()

  /* link */
  const { url } = useRouteMatch()
  const stake = { to: url + "/stake", className: styles.button }

  return (
    <article className={styles.component}>
      <div className={styles.logo}>
        <Logo height={24} />
      </div>

      <h1 className={styles.title}>Mirror ({MIR})</h1>

      <section>
        <span className={styles.apr}>
          <Count format={percent}>{dashboard?.latest24h.govAPR}</Count>
        </span>

        <p className={styles.desc}>Annual percentage rate (APR)</p>
      </section>

      <LinkButton {...stake} size="sm" outline>
        Stake
      </LinkButton>

      {address && <GovMIRFooter />}
    </article>
  )
}

export default GovMIR

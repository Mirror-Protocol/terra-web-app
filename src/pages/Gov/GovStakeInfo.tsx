import { useRouteMatch } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { useProtocol } from "../../data/contract/protocol"
import { govStakedQuery, useFindBalance } from "../../data/contract/normalize"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import { Submit } from "../../components/Button"
import styles from "./GovStakeInfo.module.scss"

const GovStakeInfo = () => {
  const { getToken } = useProtocol()
  const govStaked = useRecoilValue(govStakedQuery)
  const find = useFindBalance()

  const contents = [
    {
      title: `Staked MIR`,
      children: <Formatted symbol="MIR">{govStaked}</Formatted>,
    },
    {
      title: `Stakable MIR`,
      children: <Formatted symbol="MIR">{find(getToken("MIR"))}</Formatted>,
    },
  ]

  const { url } = useRouteMatch()
  const stake = { to: url + "/stake", className: styles.button }

  return (
    <Card>
      {contents.map((item, index) => (
        <article className={styles.item} key={index}>
          <Summary {...item} size="sm" />
        </article>
      ))}

      <Submit>
        <LinkButton {...stake}>Stake</LinkButton>
      </Submit>
    </Card>
  )
}

export default GovStakeInfo

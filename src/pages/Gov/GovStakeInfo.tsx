import { useRouteMatch } from "react-router-dom"
import { useAddress } from "../../hooks"
import { useProtocol } from "../../data/contract/protocol"
import { useGovStaked, useTokenBalances } from "../../data/contract/normalize"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import { Submit } from "../../components/Button"
import styles from "./GovStakeInfo.module.scss"

const GovStakeInfo = () => {
  const { getToken } = useProtocol()
  const address = useAddress()
  const govStaked = useGovStaked()
  const { [getToken("MIR")]: govStakable } = useTokenBalances()

  const contents = [
    {
      title: `Staked MIR`,
      children: <Formatted symbol="MIR">{govStaked}</Formatted>,
    },
    {
      title: `Stakable MIR`,
      children: <Formatted symbol="MIR">{govStakable}</Formatted>,
    },
  ]

  const { url } = useRouteMatch()

  const stake = {
    to: url + "/stake",
    className: styles.button,
    disabled: !address,
  }

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

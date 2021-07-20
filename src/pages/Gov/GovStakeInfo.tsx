import { useRouteMatch } from "react-router-dom"
import { useAddress } from "../../hooks"
import { useProtocol } from "../../data/contract/protocol"
import { useGovStaked } from "../../data/contract/normalize"
import { useTokenBalances } from "../../data/contract/normalize"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import { Submit } from "../../components/Button"
import styles from "./GovStakeInfo.module.scss"

const GovStakeInfo = () => {
  const { getToken } = useProtocol()
  const address = useAddress()
  const { contents: govStaked } = useGovStaked()
  const { contents: tokenBalances } = useTokenBalances()
  const { [getToken("MIR")]: govStakable } = tokenBalances

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
        <LinkButton {...stake}>Manage Stake</LinkButton>
      </Submit>
    </Card>
  )
}

export default GovStakeInfo

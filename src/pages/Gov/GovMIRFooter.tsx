import { MIR } from "../../constants"
import { formatAsset } from "../../libs/parse"
import { useContract, useContractsAddress } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import WithResult from "../../containers/WithResult"
import { Di } from "../../components/Dl"
import styles from "./GovMIRFooter.module.scss"

const GovMIRFooter = () => {
  const { getToken } = useContractsAddress()
  const { find } = useContract()

  const contents = [
    {
      title: `Staked ${MIR}`,
      content: (
        <WithResult keys={[BalanceKey.MIRGOVSTAKED]}>
          {formatAsset(find(BalanceKey.MIRGOVSTAKED, getToken(MIR)), MIR)}
        </WithResult>
      ),
    },
    {
      title: `Stakable ${MIR}`,
      content: (
        <WithResult keys={[BalanceKey.TOKEN]}>
          {formatAsset(find(BalanceKey.TOKEN, getToken(MIR)), MIR)}
        </WithResult>
      ),
    },
  ]

  return (
    <footer className={styles.footer}>
      {contents.map((item, index) => (
        <article className={styles.item} key={index}>
          <Di {...item} fontSize={16} type="vertical" align="center" />
        </article>
      ))}
    </footer>
  )
}

export default GovMIRFooter

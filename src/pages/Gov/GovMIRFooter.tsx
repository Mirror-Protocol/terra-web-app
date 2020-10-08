import React from "react"
import { MIR } from "../../constants"
import { formatAsset } from "../../libs/parse"
import { useContract } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import WithResult from "../../components/WithResult"
import { Di } from "../../components/Dl"
import styles from "./GovMIRFooter.module.scss"

const GovMIRFooter = () => {
  const { find } = useContract()

  const contents = [
    {
      title: `Staked ${MIR}`,
      content: (
        <WithResult keys={[BalanceKey.MIRGOVSTAKED]}>
          {formatAsset(find(BalanceKey.MIRGOVSTAKED, MIR), MIR)}
        </WithResult>
      ),
    },
    {
      title: `Stakable ${MIR}`,
      content: (
        <WithResult keys={[BalanceKey.TOKEN]}>
          {formatAsset(find(BalanceKey.TOKEN, MIR), MIR)}
        </WithResult>
      ),
    },
  ]

  return (
    <footer className={styles.footer}>
      {contents.map((item) => (
        <article className={styles.item} key={item.title}>
          <Di {...item} fontSize={16} type="vertical" align="center" />
        </article>
      ))}
    </footer>
  )
}

export default GovMIRFooter

import { useRecoilValue } from "recoil"
import { formatAsset } from "../../libs/parse"
import { useProtocol } from "../../data/contract/protocol"
import { govStakedQuery, useFindBalance } from "../../data/contract/normalize"
import { Di } from "../../components/Dl"
import styles from "./GovMIRFooter.module.scss"

const GovMIRFooter = () => {
  const { getToken } = useProtocol()
  const govStaked = useRecoilValue(govStakedQuery)
  const find = useFindBalance()

  const contents = [
    {
      title: `Staked MIR`,
      content: formatAsset(govStaked, "MIR"),
    },
    {
      title: `Stakable MIR`,
      content: formatAsset(find(getToken("MIR")), "MIR"),
    },
  ]

  return (
    <footer className={styles.footer}>
      {contents.map((item, index) => (
        <article className={styles.item} key={index}>
          <Di {...item} type="vertical" align="center" />
        </article>
      ))}
    </footer>
  )
}

export default GovMIRFooter

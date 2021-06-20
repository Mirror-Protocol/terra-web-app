import Card, { CardMain } from "../../components/Card"
import AssetItem from "../../components/AssetItem"
import { useProtocol } from "../../data/contract/protocol"
import GovAPR from "./GovAPR"
import CommunityBalance from "./CommunityBalance"
import TotalStaked from "./TotalStaked"
import styles from "./GovInfo.module.scss"

const GovInfo = () => {
  const { getToken } = useProtocol()
  const token = getToken("MIR")

  const footer = (
    <CardMain>
      <div className={styles.grid}>
        <GovAPR />

        <section className={styles.wrapper}>
          <CommunityBalance />
          <TotalStaked />
        </section>
      </div>
    </CardMain>
  )

  return (
    <Card footer={footer}>
      <AssetItem token={token} size="lg" />
    </Card>
  )
}

export default GovInfo

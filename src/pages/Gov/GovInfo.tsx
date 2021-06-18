import Card from "../../components/Card"
import Grid from "../../components/Grid"
import AssetItem from "../../components/AssetItem"
import { useProtocol } from "../../data/contract/protocol"
import GovAPR from "./GovAPR"
import CommunityBalance from "./CommunityBalance"
import TotalStaked from "./TotalStaked"

const GovInfo = () => {
  const { getToken } = useProtocol()
  const token = getToken("MIR")
  return (
    <Card>
      <AssetItem token={token} />
      <Grid>
        <GovAPR />
        <CommunityBalance />
        <TotalStaked />
      </Grid>
    </Card>
  )
}

export default GovInfo

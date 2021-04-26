import MESSAGE from "../lang/MESSAGE.json"
import Container from "../components/Container"
import Button from "../components/Button"
import { ConnectType, useWallet } from "@terra-money/wallet-provider"

const GlanceForm = () => {
  const { connect } = useWallet()
  const glance = () => connect(ConnectType.READONLY)

  return (
    <Container sm>
      <Button size="lg" onClick={glance}>
        {MESSAGE.Form.Button.ConnectWallet}
      </Button>
    </Container>
  )
}

export default GlanceForm

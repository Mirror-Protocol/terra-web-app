import MESSAGE from "../lang/MESSAGE.json"
import Button from "../components/Button"

const Reconnect = ({ refresh, name }: Network) => (
  <div className="empty">
    <p>{MESSAGE.Network.NoContract}</p>
    <p>Current network: {name}</p>

    <Button onClick={refresh} size="xs" outline>
      Refresh
    </Button>
  </div>
)

export default Reconnect

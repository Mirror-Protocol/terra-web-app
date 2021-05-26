import MESSAGE from "../lang/MESSAGE.json"

const Reconnect = ({ name }: Network) => (
  <div className="empty">
    <p>{MESSAGE.Network.NoContract}</p>
    <p>Current network: {name}</p>
  </div>
)

export default Reconnect

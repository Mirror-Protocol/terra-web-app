import { useWallet, ConnectType } from "@terra-money/wallet-provider"

const ConnectList = () => {
  const { /* availableConnectTypes, */ connect } = useWallet()

  const buttons = {
    [ConnectType.CHROME_EXTENSION]: {
      label: "CHROME_EXTENSION",
    },
    [ConnectType.WALLETCONNECT]: {
      label: "WALLETCONNECT",
    },
  }

  return (
    <ul>
      {Object.entries(buttons).map(([key, { label }]) => (
        <li key={key}>
          <button onClick={() => connect(key as ConnectType)}>{label}</button>
        </li>
      ))}
    </ul>
  )
}

export default ConnectList

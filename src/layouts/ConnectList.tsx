import { useWallet, ConnectType } from "@terra-money/wallet-provider"
import { ReactComponent as Terra } from "../images/Terra.svg"
import WalletConnect from "../images/WalletConnect.png"
import styles from "./ConnectList.module.scss"

const size = { width: 24, height: 24 }

const ConnectList = () => {
  const { /* availableConnectTypes, */ connect } = useWallet()

  const buttons = {
    [ConnectType.CHROME_EXTENSION]: {
      label: "Terra Station (extension)",
      image: <Terra {...size} />,
    },
    [ConnectType.WALLETCONNECT]: {
      label: "Terra Station (mobile)",
      image: <img src={WalletConnect} {...size} alt="WalletConnect" />,
    },
  }

  return (
    <article className={styles.component}>
      <h1 className={styles.title}>Connect to a wallet</h1>
      <section>
        {Object.entries(buttons).map(([key, { label, image }]) => (
          <button
            className={styles.button}
            onClick={() => connect(key as ConnectType)}
            key={key}
          >
            {label}
            {image}
          </button>
        ))}
      </section>
    </article>
  )
}

export default ConnectList

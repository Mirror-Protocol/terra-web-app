import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import { ReactNode } from "react"
import { ReactComponent as Terra } from "../styles/images/Terra.svg"
import WalletConnect from "../styles/images/WalletConnect.png"
import styles from "./ConnectList.module.scss"

const size = { width: 24, height: 24 }

const ConnectList = () => {
  const { availableConnectTypes, availableInstallTypes, connect, install } =
    useWallet()

  type Button = { label: string; image: ReactNode; onClick: () => void }
  const buttons = ([] as Button[])
    .concat(
      availableInstallTypes.includes(ConnectType.CHROME_EXTENSION)
        ? {
            label: "Terra Station Extension",
            image: <Terra {...size} />,
            onClick: () => install(ConnectType.CHROME_EXTENSION),
          }
        : []
    )
    .concat(
      availableConnectTypes.includes(ConnectType.WEBEXTENSION)
        ? {
            label: "Terra Station Extension",
            image: <Terra {...size} />,
            onClick: () => connect(ConnectType.WEBEXTENSION),
          }
        : availableConnectTypes.includes(ConnectType.CHROME_EXTENSION)
        ? {
            label: "Terra Station Extension",
            image: <Terra {...size} />,
            onClick: () => connect(ConnectType.CHROME_EXTENSION),
          }
        : []
    )
    .concat(
      availableConnectTypes.includes(ConnectType.WALLETCONNECT)
        ? {
            label: "Terra Station Mobile",
            image: <img src={WalletConnect} {...size} alt="WalletConnect" />,
            onClick: () => connect(ConnectType.WALLETCONNECT),
          }
        : []
    )

  return (
    <article className={styles.component}>
      <h1 className={styles.title}>Connect to a wallet</h1>
      <section>
        {Object.entries(buttons).map(([key, { label, image, onClick }]) => (
          <button className={styles.button} onClick={onClick} key={key}>
            {label}
            {image}
          </button>
        ))}
      </section>
    </article>
  )
}

export default ConnectList

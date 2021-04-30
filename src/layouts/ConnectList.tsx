import { ReactNode } from "react"
import { useWallet, ConnectType } from "@terra-money/wallet-provider"
import { useInstallChromeExtension } from "@terra-money/wallet-provider"
import { ReactComponent as Terra } from "../images/Terra.svg"
import WalletConnect from "../images/WalletConnect.png"
import styles from "./ConnectList.module.scss"

const size = { width: 24, height: 24 }

const ConnectList = () => {
  const { availableConnectTypes, connect } = useWallet()
  const installChromeExtension = useInstallChromeExtension()

  type Button = { label: string; image: ReactNode; onClick: () => void }
  const buttons = ([] as Button[])
    .concat(
      installChromeExtension
        ? {
            label: "Terra Station (extension)",
            image: <Terra {...size} />,
            onClick: installChromeExtension,
          }
        : []
    )
    .concat(
      availableConnectTypes.includes(ConnectType.CHROME_EXTENSION)
        ? {
            label: "Terra Station (extension)",
            image: <Terra {...size} />,
            onClick: () => connect(ConnectType.CHROME_EXTENSION),
          }
        : []
    )
    .concat(
      availableConnectTypes.includes(ConnectType.WALLETCONNECT)
        ? {
            label: "Terra Station (mobile)",
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

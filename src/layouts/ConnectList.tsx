import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import React from "react"
import { ReactNode } from "react"
import { ReactComponent as TerraLogo } from "images/Token/Terra.svg"
import WalletConnect from "images/WalletConnect.png"
import styles from "./ConnectList.module.scss"
import { useConnectModal } from "hooks"
import SupportModal from "./SupportModal"
import { useModal } from "components/Modal"

const size = { width: 30, height: "auto" }

const ConnectList = () => {
  const { availableConnectTypes, availableInstallTypes, connect } = useWallet()
  const connectModal = useConnectModal()
  const supportModal = useModal()

  type Button = { label: string; image: ReactNode; onClick: () => void }
  const buttons = ([] as Button[])
    .concat(
      availableInstallTypes.includes(ConnectType.CHROME_EXTENSION)
        ? {
            label: "Terra Station (extension)",
            image: <TerraLogo {...size} />,
            onClick: () => {
              supportModal.open()
            },
          }
        : []
    )
    .concat(
      availableConnectTypes.includes(ConnectType.WEBEXTENSION)
        ? {
            label: "Terra Station (extension)",
            image: <TerraLogo {...size} />,
            onClick: () => {
              connect(ConnectType.WEBEXTENSION)
              connectModal.close()
            },
          }
        : availableConnectTypes.includes(ConnectType.CHROME_EXTENSION)
        ? {
            label: "Terra Station (extension)",
            image: <TerraLogo {...size} />,
            onClick: () => {
              connect(ConnectType.CHROME_EXTENSION)
              connectModal.close()
            },
          }
        : []
    )
    .concat(
      availableConnectTypes.includes(ConnectType.WALLETCONNECT)
        ? {
            label: "Terra Station (mobile)",
            image: <img src={WalletConnect} {...size} alt="WalletConnect" />,
            onClick: () => {
              connect(ConnectType.WALLETCONNECT)
              connectModal.close()
            },
          }
        : []
    )

  return (
    <article className={styles.component}>
      <SupportModal {...supportModal} />
      <section>
        {Object.entries(buttons).map(([key, { label, image, onClick }]) => (
          <button className={styles.button} onClick={onClick} key={key}>
            {image}
            &nbsp;&nbsp;
            {label}
          </button>
        ))}
      </section>
    </article>
  )
}

export default ConnectList

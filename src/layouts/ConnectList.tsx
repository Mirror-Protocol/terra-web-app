import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import React from "react"
import { ReactNode } from "react"
import { ReactComponent as TerraLogo } from "images/Token/Terra.svg"
import { ReactComponent as XDefiLogo } from "images/Wallets/xdefi.svg"
import WalletConnect from "images/WalletConnect.png"
import styles from "./ConnectList.module.scss"
import { useConnectModal } from "hooks"
import SupportModal from "./SupportModal"
import { useModal } from "components/Modal"

declare global {
  interface Window {
    xfi: {
      terra: any
    }
  }
}

const size = { width: 30, height: "auto" }

const ConnectList = () => {
  const { availableConnectTypes, availableInstallTypes, connect } = useWallet()
  const connectModal = useConnectModal()
  const supportModal = useModal()

  type Button = { label: string; image: ReactNode; onClick: () => void }

  const buttons: Button[] = []

  if (availableInstallTypes.includes(ConnectType.CHROME_EXTENSION)) {
    buttons.push({
      label: "Terra Station (extension)",
      image: <TerraLogo {...size} />,
      onClick: () => {
        supportModal.open()
      },
    })

    buttons.push({
      label: "XDEFI Wallet (extension)",
      image: <XDefiLogo {...size} />,
      onClick: () => {
        supportModal.open()
      },
    })
  }

  if (availableConnectTypes.includes(ConnectType.WEB_CONNECT)) {
    buttons.push({
      label: "Terra Station (extension)",
      image: <TerraLogo {...size} />,
      onClick: () => {
        connect(ConnectType.WEB_CONNECT)
        connectModal.close()
      },
    })
  } else if (availableConnectTypes.includes(ConnectType.CHROME_EXTENSION)) {
    // NOTE: We are not able to identify if Terra Station is available, IF XDeFi
    // is available as well, because they both set `window.isTerraExtensionAvailable = true`
    // so even if Terra Station not available, XDeFi Wallet will popup.
    buttons.push({
      label: "Terra Station (extension)",
      image: <TerraLogo {...size} />,
      onClick: () => {
        connect(ConnectType.CHROME_EXTENSION)
        connectModal.close()
      },
    })

    if (window.xfi?.terra) {
      buttons.push({
        label: "XDEFI Wallet (extension)",
        image: <XDefiLogo {...size} />,
        onClick: () => {
          connect(ConnectType.CHROME_EXTENSION)
          connectModal.close()
        },
      })
    } else {
      buttons.push({
        label: "XDEFI Wallet (extension)",
        image: <XDefiLogo {...size} />,
        onClick: () => {
          supportModal.open()
        },
      })
    }
  }

  if (availableConnectTypes.includes(ConnectType.WALLETCONNECT)) {
    buttons.push({
      label: "Terra Station (mobile)",
      image: <img src={WalletConnect} {...size} alt="WalletConnect" />,
      onClick: () => {
        connect(ConnectType.WALLETCONNECT)
        connectModal.close()
      },
    })
  }

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

import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import React from "react"
import { ReactNode } from "react"
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
  const { availableConnections, availableInstallations, connect } = useWallet()
  const connectModal = useConnectModal()
  const supportModal = useModal()

  type Button = { label: string; image: ReactNode; onClick: () => void }

  const buttons: Button[] = []

  availableConnections
    .filter(({ type }) => type !== ConnectType.READONLY)
    .map(({ type, icon, name, identifier }) =>
      buttons.push({
        label: name,
        image: <img src={icon} {...size} alt={name} />,
        onClick: () => {
          connect(type, identifier)
          connectModal.close()
        },
      })
    )
  availableInstallations
    .filter(({ type }) => type !== ConnectType.READONLY)
    .map(({ icon, name, url }) =>
      buttons.push({
        label: "Install " + name,
        image: <img src={icon} {...size} alt={name} />,
        onClick: () => {
          supportModal.setInfo(url, name)
          supportModal.open()
        },
      })
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

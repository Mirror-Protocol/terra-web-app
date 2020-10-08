import React from "react"
import MESSAGE from "../lang/MESSAGE.json"
import { EXTENSION } from "../constants"
import { useWallet } from "../hooks"
import Card from "./Card"
import ExtLink from "./ExtLink"
import styles from "./ConnectionRequired.module.scss"

const ConnectionRequired = () => {
  const { installed, connect } = useWallet()

  const contents = !installed
    ? {
        action: (
          <ExtLink href={EXTENSION}>{MESSAGE.Wallet.DownloadExtension}</ExtLink>
        ),
      }
    : {
        action: (
          <button className={styles.button} onClick={connect}>
            {MESSAGE.Wallet.ConnectWallet}
          </button>
        ),
      }

  return (
    <Card>
      <p className="empty">{contents.action}</p>
    </Card>
  )
}

export default ConnectionRequired

import MESSAGE from "../lang/MESSAGE.json"
import { EXTENSION } from "../constants"
import { useWallet } from "../hooks"
import ExtLink from "../components/ExtLink"
import Empty from "../components/Empty"
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

  return <Empty>{contents.action}</Empty>
}

export default ConnectionRequired

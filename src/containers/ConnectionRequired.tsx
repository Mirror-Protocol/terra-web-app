import { Link } from "react-router-dom"
import classNames from "classnames"
import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import MESSAGE from "../lang/MESSAGE.json"
import { EXTENSION } from "../constants"
import ExtLink from "../components/ExtLink"
import Empty from "../components/Empty"
import styles from "./ConnectionRequired.module.scss"

const ConnectionRequired = () => {
  const installed = true
  const { connect } = useWallet()

  const action = !installed ? (
    <ExtLink href={EXTENSION}>{MESSAGE.Wallet.DownloadExtension}</ExtLink>
  ) : (
    <button
      className={styles.button}
      onClick={() => connect(ConnectType.CHROME_EXTENSION)}
    >
      {MESSAGE.Wallet.ConnectWallet}
    </button>
  )

  return (
    <Empty>
      <Link to="/auth" className={classNames(styles.button, "mobile")}>
        {MESSAGE.Wallet.Glance}
      </Link>
      <div className="desktop">{action}</div>
    </Empty>
  )
}

export default ConnectionRequired

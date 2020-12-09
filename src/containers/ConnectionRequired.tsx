import { Link } from "react-router-dom"
import classNames from "classnames"
import MESSAGE from "../lang/MESSAGE.json"
import { EXTENSION } from "../constants"
import { useWallet } from "../hooks"
import ExtLink from "../components/ExtLink"
import Empty from "../components/Empty"
import styles from "./ConnectionRequired.module.scss"

const ConnectionRequired = () => {
  const { installed, connect } = useWallet()

  const action = !installed ? (
    <ExtLink href={EXTENSION}>{MESSAGE.Wallet.DownloadExtension}</ExtLink>
  ) : (
    <button className={styles.button} onClick={connect}>
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

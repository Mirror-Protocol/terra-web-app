import { FC, ReactNode } from "react"
import ConnectButton from "./ConnectButton"
import WithAbsolute from "./WithAbsolute"
import styles from "./ConnectedButton.module.scss"

interface Props {
  address: string
  balance?: ReactNode
  info: (close: () => void) => ReactNode
}

const ConnectedButton: FC<Props> = ({ address, balance, info }) => (
  <WithAbsolute content={({ close }) => info(close)} trigger={address}>
    {({ toggle }) => (
      <ConnectButton
        address={address}
        className={styles.connected}
        onClick={toggle}
      >
        {balance && <strong className={styles.balance}>{balance}</strong>}
      </ConnectButton>
    )}
  </WithAbsolute>
)

export default ConnectedButton

import { FC } from "react"
import classNames from "classnames"
import Icon from "./Icon"
import styles from "./ConnectButton.module.scss"

interface Props {
  address?: string
  className?: string
  onClick: () => void
}

const ConnectButton: FC<Props> = (props) => {
  const { address, className, children, ...attrs } = props

  return (
    <button {...attrs} className={classNames(styles.button, className)}>
      <Icon name="account_balance_wallet" size={14} />
      {address && <span className={styles.address}>{address}</span>}
      {children}
    </button>
  )
}

export default ConnectButton

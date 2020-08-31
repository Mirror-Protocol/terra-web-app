import { FC, ReactNode, useEffect, useRef, useState } from "react"
import useOnClickOutside from "use-onclickoutside"
import ConnectButton from "./ConnectButton"
import styles from "./ConnectedButton.module.scss"

interface Props {
  address: string
  balance?: ReactNode
  info: (close: () => void) => ReactNode
}

const ConnectedButton: FC<Props> = ({ address, balance, info }) => {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  /* close card on click outside */
  useOnClickOutside(ref, close)

  /* close card on disconnected */
  useEffect(() => {
    close()
  }, [address])

  return (
    <div className={styles.wrapper} ref={ref}>
      <ConnectButton
        address={address}
        className={styles.connected}
        onClick={toggle}
      >
        {balance && <strong className={styles.balance}>{balance}</strong>}
      </ConnectButton>

      {isOpen && info(close)}
    </div>
  )
}

export default ConnectedButton

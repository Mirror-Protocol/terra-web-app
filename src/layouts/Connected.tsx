import { ReactNode, useEffect, useRef, useState } from "react"
import useOnClickOutside from "use-onclickoutside"
import classNames from "classnames"
import { truncate } from "../libs/text"
import { useWallet } from "../hooks"
import Balance from "./Balance"
import Wallet from "./Wallet"
import styles from "./Connected.module.scss"

interface Props {
  className: string
  icon: ReactNode
}

const Connected = ({ className, icon }: Props) => {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  /* close wallet on click outside */
  const { address } = useWallet()
  useOnClickOutside(ref, close)
  useEffect(() => {
    close()
  }, [address])

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={classNames(styles.connected, className)}
        onClick={toggle}
      >
        {icon}
        <span className={styles.address}>{truncate(address)}</span>
        <strong className={styles.balance}>
          <Balance />
        </strong>
      </button>

      {isOpen && <Wallet close={close} />}
    </div>
  )
}

export default Connected

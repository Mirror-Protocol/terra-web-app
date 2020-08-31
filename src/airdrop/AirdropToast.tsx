import { useState } from "react"
import { ReactComponent as Image } from "./Airdrop.svg"
import LinkButton from "../components/LinkButton"
import Icon from "../components/Icon"
import styles from "./AirdropToast.module.scss"

const AirdropToast = () => {
  const [isOpen, setIsOpen] = useState(true)
  const close = () => setIsOpen(false)

  return !isOpen ? null : (
    <div className={styles.toast}>
      <button className={styles.close} onClick={close}>
        <Icon name="close" size={18} />
      </button>

      <Image height={80} className={styles.image} />
      <header className={styles.header}>MIR Airdrop</header>
      <p className={styles.content}>Claim your MIR tokens</p>

      <LinkButton to="/airdrop" onClick={close} color="aqua" block>
        Claim
      </LinkButton>
    </div>
  )
}

export default AirdropToast

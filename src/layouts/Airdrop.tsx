import { useState } from "react"
import { MIR } from "../constants"
import { ReactComponent as Logo } from "../images/MIR.svg"
import useAirdrops from "../statistics/useAirdrops"
import LinkButton from "../components/LinkButton"
import Icon from "../components/Icon"
import styles from "./Airdrop.module.scss"

const Airdrop = () => {
  const airdrops = useAirdrops()

  /* Toggle */
  const [isOpen, setIsOpen] = useState(true)
  const close = () => setIsOpen(false)

  return !isOpen || !airdrops?.length ? null : (
    <div className={styles.toast}>
      <button className={styles.close} onClick={close}>
        <Icon name="close" size={18} />
      </button>

      <header className={styles.header}>
        <Logo height={24} />
        {MIR} tokens can be claimed
      </header>

      <p className={styles.content}>
        Claim your {MIR} tokens to participate in Mirror.
      </p>

      <LinkButton to="/airdrop" onClick={close} color="aqua" size="sm" block>
        Claim
      </LinkButton>
    </div>
  )
}

export default Airdrop

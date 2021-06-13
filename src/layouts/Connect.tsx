import React from "react"
import MESSAGE from "../lang/MESSAGE.json"
import { useWallet } from "../hooks"
import { useModal } from "../components/Modal"
import Icon from "../components/Icon"
import Connected from "./Connected"
import SupportModal from "./SupportModal"
import styles from "./Connect.module.scss"

const Connect = () => {
  const { address, installed, connect } = useWallet()
  const modal = useModal()
  const icon = <Icon name="account_balance_wallet" size={16} />
  const handleClick = () => (installed ? connect() : modal.open())

  return !address ? (
    <>
      <button className={styles.button} onClick={handleClick}>
        {icon}
        <span className={styles.msg}>{MESSAGE.Wallet.Connect}</span>
      </button>

      <SupportModal {...modal} />
    </>
  ) : (
    <Connected className={styles.button} icon={icon} />
  )
}

export default Connect

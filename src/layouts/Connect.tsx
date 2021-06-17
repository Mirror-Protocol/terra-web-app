import React, { useMemo } from "react"
import MESSAGE from "../lang/MESSAGE.json"
import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import { useModal } from "../components/Modal"
import Icon from "../components/Icon"
import Connected from "./Connected"
import SupportModal from "./SupportModal"
import styles from "./Connect.module.scss"
import { useAddress } from "hooks"

const Connect = () => {
  const address = useAddress()
  const { availableConnectTypes, connect } = useWallet()
  const installed = useMemo(() => {
    return availableConnectTypes.includes(ConnectType.CHROME_EXTENSION)
  }, [availableConnectTypes])
  const modal = useModal()
  const icon = <Icon name="account_balance_wallet" size={16} />
  const handleClick = () =>
    installed ? connect(ConnectType.CHROME_EXTENSION) : modal.open()

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

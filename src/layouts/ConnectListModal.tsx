import React from "react"
import Card from "components/Card"
import Modal from "components/Modal"
import ConnectList from "./ConnectList"
import styles from "./ConnectList.module.scss"

const ConnectListModal = (modal: Modal) => {
  return (
    <Modal {...modal} className={styles.wrapper}>
      <Card>
        <h1 className={styles.title}>Connect the wallet</h1>
        <ConnectList />
      </Card>
    </Modal>
  )
}

export default ConnectListModal

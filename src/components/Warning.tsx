import React from "react"

import Modal from "components/Modal"

import styles from "./Warning.module.scss"
import MESSAGE from "../lang/MESSAGE.json"
import Button from "components/Button"

const WarningModal = (modal: Modal) => {
  return (
    <Modal {...modal}>
      <div className={styles.component}>
        <p className={styles.title}>{MESSAGE.Confirm.Title.Warning}</p>
        <p className={styles.spread}>
          {MESSAGE.Confirm.Warning.SpreadInfo + modal.name}
        </p>
        <p className={styles.message}>{MESSAGE.Confirm.Warning.Spread}</p>
        <Button className={styles.button} onClick={() => modal.close()}>
          {MESSAGE.Form.Button.Okay}
        </Button>
      </div>
    </Modal>
  )
}

export default WarningModal

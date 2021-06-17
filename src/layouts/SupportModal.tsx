import React from "react"
import { CHROME, EXTENSION } from "constants/constants"
import Modal from "components/Modal"
import Card from "components/Card"
import ExtLinkButton from "components/ExtLinkButton"
import styles from "./SupportModal.module.scss"

const SupportModal = (modal: Modal) => {
  const handleInstalled = () => {
    window.location.reload()
  }

  return (
    <Modal {...modal}>
      {!navigator.userAgent.includes("Chrome") ? (
        <Card>
          <article className={styles.article}>
            <p className={styles.desc}>
              {"Terraswap currently\nonly support Chrome"}
            </p>

            <ExtLinkButton href={CHROME} size="lg" block>
              Download Chrome
            </ExtLinkButton>
          </article>
        </Card>
      ) : (
        <>
          <Card>
            <article className={styles.article}>
              <p className={styles.desc}>
                {"Download Terra Station Extension\nto connect your wallet"}
              </p>

              <ExtLinkButton href={EXTENSION} size="lg" block>
                Download Terra Station Extension
              </ExtLinkButton>
              <button className={styles.installed} onClick={handleInstalled}>
                I installed it.
              </button>
            </article>
          </Card>
        </>
      )}
    </Modal>
  )
}

export default SupportModal

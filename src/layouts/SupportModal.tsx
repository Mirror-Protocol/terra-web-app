import React from "react"
import {
  CHROME,
  TERRA_STATION_EXTENSION,
  XDEFI_EXTENSION,
} from "constants/constants"
import Modal from "components/Modal"
import Card from "components/Card"
import ExtLinkButton from "components/ExtLinkButton"
import styles from "./SupportModal.module.scss"
import styled from "styled-components"

const DownloadExtButton = styled(ExtLinkButton)`
  margin: 10px 0px !important;
`

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

              <DownloadExtButton href={TERRA_STATION_EXTENSION} size="lg" block>
                Download Terra Station Extension
              </DownloadExtButton>

              {!window.xfi?.terra && (
                <DownloadExtButton href={XDEFI_EXTENSION} size="lg" block>
                  Download XDeFi Wallet Extension
                </DownloadExtButton>
              )}

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

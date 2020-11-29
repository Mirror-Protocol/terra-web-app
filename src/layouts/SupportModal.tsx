import { CHROME, EXTENSION } from "../constants"
import { useWallet } from "../hooks"
import Modal from "../containers/Modal"
import Card from "../components/Card"
import ExtLinkButton from "../components/ExtLinkButton"
import styles from "./SupportModal.module.scss"

const SupportModal = (modal: Modal) => {
  const { install } = useWallet()

  const handleInstalled = () => {
    install()
    window.location.reload()
  }

  return (
    <Modal {...modal}>
      {!navigator.userAgent.includes("Chrome") ? (
        <Card>
          <article className={styles.article}>
            <p className={styles.desc}>
              {"Mirror currently\nonly supports Chrome"}
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
            </article>
          </Card>

          <button className={styles.installed} onClick={handleInstalled}>
            I installed it.
          </button>
        </>
      )}
    </Modal>
  )
}

export default SupportModal

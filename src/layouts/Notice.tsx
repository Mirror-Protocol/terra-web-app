import ExtLink from "../components/ExtLink"
import Modal, { useModal } from "../containers/Modal"
import styles from "./Notice.module.scss"

const LINK = "https://twitter.com/mirror_protocol/status/1442972339524698114"
const LOCAL_STORAGE_KEY = "doNotShowAgainColumbus5"

const Notice = () => {
  const modal = useModal(!localStorage.getItem(LOCAL_STORAGE_KEY))
  const doNotShowAgain = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, String(Date.now()))
    modal.close()
  }

  return (
    <Modal {...modal}>
      <article className={styles.article}>
        <p>
          Due to Columbus-5 chain migration, Mirror web App will halt at block
          height 4,724,000.
        </p>

        <section>
          <h2>Estimated Halt Time</h2>
          <p>Thu Sep 30 2021 07:00:00 UTC ~ 09:00:00 UTC</p>
        </section>

        <p>
          Read the details to the migration process and risks{" "}
          <ExtLink href={LINK}>here</ExtLink>.
        </p>

        <p className={styles.close}>
          <button onClick={doNotShowAgain}>Do not show again</button>
        </p>
      </article>
    </Modal>
  )
}

export default Notice

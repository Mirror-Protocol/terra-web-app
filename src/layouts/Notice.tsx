import ExtLink from "../components/ExtLink"
import Modal, { useModal } from "../containers/Modal"
import styles from "./Notice.module.scss"

const LINK = "https://twitter.com/mirror_protocol/status/1438352057660936200"
const LOCAL_STORAGE_KEY = "doNotShowAgainColumbus5Oracle"

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
          Price oracle feed is expected to resume at Thu Sep 30 2021 17:30:00
          UTC.
        </p>

        <p>
          Operations requiring price oracle feed (Borrow, Short and Withdraw
          Collateral) will resume at the time mentioned above.
        </p>

        <p>
          For more information, read <ExtLink href={LINK}>here</ExtLink>.
        </p>

        <p className={styles.close}>
          <button onClick={doNotShowAgain}>Do not show again</button>
        </p>
      </article>
    </Modal>
  )
}

export default Notice

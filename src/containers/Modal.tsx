import { FC, useState } from "react"
import ReactModal from "react-modal"
import styles from "./Modal.module.scss"

ReactModal.setAppElement("#mirror")

const Modal: FC<Modal> = ({ isOpen, close, children }) => (
  <ReactModal
    className={styles.modal}
    overlayClassName={styles.overlay}
    isOpen={isOpen}
    onRequestClose={close}
  >
    {children}
  </ReactModal>
)

export default Modal

/* modal */
export const useModal = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial)
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }
}

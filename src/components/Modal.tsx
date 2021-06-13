import React, { FC, useState } from "react"
import ReactModal from "react-modal"
import styles from "./Modal.module.scss"
import Icon from "./Icon"

ReactModal.setAppElement("#terraswap")

const Modal: FC<Modal> = ({ isOpen, close, children, isCloseBtn=false }) => (
  <ReactModal
    className={styles.modal}
    overlayClassName={styles.overlay}
    isOpen={isOpen}
    onRequestClose={close}
  >
    {isCloseBtn && <div className={styles.close}>
      <span onClick={close}><Icon name="close" size={30} color={"#0222BA"}/></span>
    </div>}
    {children}
  </ReactModal>
)

export default Modal

/* modal */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }
}

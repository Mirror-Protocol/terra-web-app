import Modal from "../containers/Modal"
import ConnectList from "./ConnectList"

const ConnectListModal = (modal: Modal) => {
  return (
    <Modal {...modal}>
      <ConnectList />
    </Modal>
  )
}

export default ConnectListModal

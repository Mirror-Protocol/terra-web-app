import Card from "../components/Card"
import Modal from "../containers/Modal"
import ConnectList from "./ConnectList"

const ConnectListModal = (modal: Modal) => {
  return (
    <Modal {...modal}>
      <Card>
        <ConnectList />
      </Card>
    </Modal>
  )
}

export default ConnectListModal

import Tippy from "@tippyjs/react"
import { bound } from "../components/Boundary"
import { DropdownTippyProps } from "../components/Tooltip"
import ConnectButton from "../components/ConnectButton"
import ConnectedInfo from "./ConnectedInfo"
import Balance from "./Balance"
import styles from "./Connected.module.scss"

const Connected = ({ className }: { className?: string }) => {
  return (
    <Tippy {...DropdownTippyProps} render={() => <ConnectedInfo />}>
      <ConnectButton>
        <div className={styles.button}>{bound(<Balance />)}</div>
      </ConnectButton>
    </Tippy>
  )
}

export default Connected

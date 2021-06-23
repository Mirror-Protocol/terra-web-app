import { useRecoilValue } from "recoil"
import Tippy from "@tippyjs/react"
import { locationKeyState } from "../data/app"
import { bound } from "../components/Boundary"
import { DropdownTippyProps } from "../components/Tooltip"
import ConnectButton from "../components/ConnectButton"
import ConnectedInfo from "./ConnectedInfo"
import Balance from "./Balance"
import styles from "./Connected.module.scss"

const Connected = () => {
  const key = useRecoilValue(locationKeyState)

  return (
    <Tippy {...DropdownTippyProps} render={() => <ConnectedInfo />} key={key}>
      <ConnectButton connected>
        <div className={styles.button}>{bound(<Balance />)}</div>
      </ConnectButton>
    </Tippy>
  )
}

export default Connected

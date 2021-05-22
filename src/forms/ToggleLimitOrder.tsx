import { Dispatch, SetStateAction } from "react"
import classNames from "classnames/bind"
import Toggle from "../components/Toggle"
import styles from "./ToggleLimitOrder.module.scss"

const cx = classNames.bind(styles)

interface Props {
  state: [boolean, Dispatch<SetStateAction<boolean>>]
}

const ToggleLimitOrder = ({ state }: Props) => {
  const [isOn, setIsOn] = state
  const toggle = () => setIsOn(!isOn)

  return (
    <button
      type="button"
      className={cx(styles.button, { on: isOn })}
      onClick={toggle}
    >
      <Toggle className={styles.toggle} on={isOn} />
      Limit Order
    </button>
  )
}

export default ToggleLimitOrder

import classNames from "classnames"
import { useState } from "react"
import { useProtocol } from "../data/contract/protocol"
import styles from "./AssetIcon.module.scss"

interface Props {
  symbol: string
  small?: boolean
  className?: string
}

const AssetIcon = ({ symbol, small, className }: Props) => {
  const { getToken, getIcon } = useProtocol()
  const token = getToken(symbol)
  const icon = getIcon(token)

  const [error, setError] = useState(false)

  return !icon || error ? null : (
    <img
      src={icon}
      className={classNames(small ? styles.small : styles.default, className)}
      onError={() => setError(true)}
      alt=""
    />
  )
}

export default AssetIcon

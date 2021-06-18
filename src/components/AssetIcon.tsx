import classNames from "classnames/bind"
import { useState } from "react"
import { useProtocol } from "../data/contract/protocol"
import styles from "./AssetIcon.module.scss"

const cx = classNames.bind(styles)

interface Props {
  symbol: string
  size?: AssetSize
  idle?: boolean
  className?: string
}

const AssetIcon = ({ symbol, size = "default", idle, className }: Props) => {
  const { getToken, getIcon } = useProtocol()
  const [error, setError] = useState(false)

  const attrs = { className: cx(size, { idle }, className) }

  if (idle) return <div {...attrs} />

  const token = getToken(symbol)
  const icon = getIcon(token)

  return !icon || error ? null : (
    <img {...attrs} src={icon} onError={() => setError(true)} alt="" />
  )
}

export default AssetIcon

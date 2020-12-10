import { ReactNode, useEffect, useRef, useState } from "react"
import useOnClickOutside from "use-onclickoutside"
import styles from "./WithAbsoulte.module.scss"

interface Params {
  open: () => void
  close: () => void
  toggle: () => void
}

interface Props {
  trigger?: string
  content: (params: Params) => ReactNode
  children: (params: Params) => ReactNode
}

const WithAbsolute = ({ trigger, content, children }: Props) => {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)
  const params = { open, close, toggle }

  /* close card on click outside */
  useOnClickOutside(ref, close)

  /* close card on trigger change */
  useEffect(() => {
    close()
  }, [trigger])

  return (
    <div className={styles.wrapper} ref={ref}>
      {children(params)}
      {isOpen && <div className={styles.card}>{content(params)}</div>}
    </div>
  )
}

export default WithAbsolute

import { FC } from "react"
import classNames from "classnames"
import Icon from "./Icon"
import styles from "./ConnectButton.module.scss"

interface Props {
  className?: string
  onClick?: () => void
}

const ConnectButton: FC<Props> = ({ className, onClick, children }) => {
  const attrs = {
    className: classNames(styles.component, className),
    children: (
      <>
        <section className={styles.wrapper}>
          <Icon name="Wallet" size={14} />
          {children}
        </section>

        <Icon name="ChevronRight" size={8} />
      </>
    ),
  }

  return onClick ? <button {...attrs} onClick={onClick} /> : <div {...attrs} />
}

export default ConnectButton

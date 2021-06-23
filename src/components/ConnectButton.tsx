import { FC, forwardRef } from "react"
import classNames from "classnames/bind"
import Icon from "./Icon"
import styles from "./ConnectButton.module.scss"

const cx = classNames.bind(styles)

interface Props {
  connected?: boolean
  className?: string
  onClick?: () => void
}

const ConnectButton: FC<Props> = forwardRef(
  ({ connected, className, onClick, children }, ref: any) => {
    const attrs = {
      className: cx(styles.component, className, { connected }),
      children: (
        <>
          <section className={styles.wrapper}>
            <Icon name="Wallet" size={14} />
            {children}
          </section>

          <Icon name="ChevronRight" size={8} />
        </>
      ),
      ref,
    }

    return <button {...attrs} onClick={onClick} />
  }
)

export default ConnectButton

import { FC, forwardRef } from "react"
import classNames from "classnames"
import Icon from "./Icon"
import styles from "./ConnectButton.module.scss"

interface Props {
  className?: string
  onClick?: () => void
}

const ConnectButton: FC<Props> = forwardRef(
  ({ className, onClick, children }, ref: any) => {
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
      ref,
    }

    return <button {...attrs} onClick={onClick} />
  }
)

export default ConnectButton

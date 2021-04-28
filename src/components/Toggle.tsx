import classNames from "classnames/bind"
import styles from "./Toggle.module.scss"

const cx = classNames.bind(styles)

const Toggle = ({ className, on }: { className: string; on: boolean }) => (
  <div className={cx(styles.track, { on }, className)}>
    <div className={styles.thumb} />
  </div>
)

export default Toggle

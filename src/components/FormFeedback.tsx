import { FC } from "react"
import classNames from "classnames/bind"
import Icon from "./Icon"
import styles from "./FormFeedback.module.scss"

const cx = classNames.bind(styles)

interface Props {
  type: "error" | "warn" | "help"
  full?: boolean
}

const FormFeedback: FC<Props> = ({ children, type, full }) => {
  const icon = {
    error: "ExclamationCircleSolid",
    warn: "ExclamationTriangleSolid",
    help: "InfoCircle",
  }[type] as IconNames

  return (
    <div className={cx(styles.component, type, { full })}>
      <Icon name={icon} className={styles.icon} size={16} />
      <div>{children}</div>
    </div>
  )
}

export default FormFeedback

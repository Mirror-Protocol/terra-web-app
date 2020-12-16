import { FC } from "react"
import classNames from "classnames/bind"
import Icon from "./Icon"
import styles from "./FormFeedback.module.scss"

const cx = classNames.bind(styles)

const FormFeedback: FC<{ help?: boolean }> = ({ children, help }) => {
  const icon = { size: 16, className: cx(styles.icon, { red: !help }) }

  return (
    <div className={cx(styles.component, { help })}>
      {help ? (
        <Icon name="info_outline" {...icon} />
      ) : (
        <Icon name="warning" {...icon} />
      )}

      <p>{children}</p>
    </div>
  )
}

export default FormFeedback

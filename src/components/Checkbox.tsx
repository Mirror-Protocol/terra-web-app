import { FC, LabelHTMLAttributes } from "react"
import classNames from "classnames/bind"
import styles from "./Checkbox.module.scss"

const cx = classNames.bind(styles)

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  type?: "checkbox" | "radio"
  checked: boolean
  className?: string
}

const Checkbox: FC<Props> = (props) => {
  const { type = "checkbox", checked, className, children, ...attrs } = props

  return (
    <label {...attrs} className={classNames(styles.label, className)}>
      <div className={cx(styles.input, type)}>
        <div className={cx(styles.check, { checked })} />
      </div>

      {children}
    </label>
  )
}

export default Checkbox

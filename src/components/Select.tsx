import { OptionHTMLAttributes, SelectHTMLAttributes } from "react"
import classNames from "classnames/bind"
import Icon from "./Icon"
import styles from "./Select.module.scss"

const cx = classNames.bind(styles)

export interface Props {
  attrs: SelectHTMLAttributes<HTMLSelectElement>
  options: OptionHTMLAttributes<HTMLOptionElement>[]
  right?: boolean
}

const Select = ({ attrs, options, right }: Props) => {
  return (
    <div className={cx(styles.select, { right })}>
      <select {...attrs}>
        {options.map((item, index) => (
          <option {...item} key={index} />
        ))}
      </select>

      <Icon name="ChevronDown" size={8} />
    </div>
  )
}

export default Select

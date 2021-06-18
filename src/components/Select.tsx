import { OptionHTMLAttributes, SelectHTMLAttributes } from "react"
import Icon from "./Icon"
import styles from "./Select.module.scss"

export interface Props {
  attrs: SelectHTMLAttributes<HTMLSelectElement>
  options: OptionHTMLAttributes<HTMLOptionElement>[]
}

const Select = ({ attrs, options }: Props) => {
  return (
    <div className={styles.select}>
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

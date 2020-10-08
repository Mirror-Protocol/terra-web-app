import React, { ReactNode } from "react"
import classNames from "classnames/bind"
import Checkbox from "./Checkbox"
import styles from "./FormCheck.module.scss"

const cx = classNames.bind(styles)

interface Item {
  attrs: Input
  label: ReactNode
}

interface Props {
  list: Item[]
  horizontal?: boolean
}

const FormCheck = ({ list, horizontal }: Props) => (
  <div className={cx(styles.group, { horizontal })}>
    {list.map(({ attrs, label }) => (
      <div className={styles.item} key={attrs.id}>
        <input {...attrs} hidden />
        <Checkbox type={attrs.type} checked={attrs.checked} htmlFor={attrs.id}>
          {label}
        </Checkbox>
      </div>
    ))}
  </div>
)

export default FormCheck

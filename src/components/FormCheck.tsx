import { ReactNode } from "react"
import classNames from "classnames/bind"
import Checkbox from "./Checkbox"
import formStyles from "./FormGroup.module.scss"
import styles from "./FormCheck.module.scss"

const cx = classNames.bind(styles)

interface Item {
  attrs: Input
  label: ReactNode
}

interface Props {
  label?: string
  list: Item[]
  horizontal?: boolean
}

const FormCheck = ({ label, list, horizontal }: Props) => (
  <div className={classNames(formStyles.group, styles.group)}>
    {label && (
      <header className={formStyles.header}>
        <section className={formStyles.label}>
          <label>{label}</label>
        </section>
      </header>
    )}

    <section className={cx({ horizontal })}>
      {list.map(({ attrs, label }) => (
        <div className={styles.item} key={attrs.id}>
          <input {...attrs} hidden />
          <Checkbox
            type={attrs.type}
            checked={attrs.checked}
            htmlFor={attrs.id}
          >
            {label}
          </Checkbox>
        </div>
      ))}
    </section>
  </div>
)

export default FormCheck

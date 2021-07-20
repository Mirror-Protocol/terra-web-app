import { ButtonHTMLAttributes, FC, ReactNode } from "react"
import classNames from "classnames/bind"
import Loading from "./Loading"
import styles from "./Button.module.scss"

const cx = classNames.bind(styles)

export interface ButtonInterface {
  /** xs: 22px; sm: 26px; md: 36px; lg: 50px */
  size?: "xs" | "sm" | "md" | "lg"
  color?: string
  outline?: boolean
  block?: boolean

  loading?: boolean

  disabled?: boolean
  className?: string
  children?: ReactNode
}

export type ButtonAttrs = ButtonHTMLAttributes<HTMLButtonElement>
export type ButtonProps = ButtonInterface & ButtonAttrs

const Button = (props: ButtonProps) => {
  const { loading, children } = props
  return (
    <button {...getAttrs(props)}>
      {loading ? <Loading className={styles.progress} /> : children}
    </button>
  )
}

export default Button

/* styles */
export const getAttrs = <T extends ButtonInterface>(props: T) => {
  const { size = "md", color = "blue", outline, block, ...rest } = props
  const { loading, ...attrs } = rest
  const status = { outline, block, loading, disabled: attrs.disabled }
  const className = cx(styles.button, size, color, status, attrs.className)
  return { ...attrs, className }
}

export const Submit: FC = ({ children }) => (
  <div className={styles.submit}>{children}</div>
)

import { FC } from "react"
import Tippy, { TippyProps } from "@tippyjs/react"
import classNames from "classnames"
import { isNil } from "ramda"
import Icon from "./Icon"

import "tippy.js/dist/tippy.css"
import "tippy.js/themes/light-border.css"
import styles from "./Tooltip.module.scss"

export const DefaultTippyProps: TippyProps = {
  animation: false,
  interactive: true,
  appendTo: document.body,
}

export const DropdownTippyProps: TippyProps = {
  ...DefaultTippyProps,
  placement: "bottom-end",
  trigger: "click",
}

const TooltipTippyProps: TippyProps = {
  ...DefaultTippyProps,
  placement: "top",
  theme: "light-border",
  className: styles.tooltip,
}

interface Props extends Omit<TippyProps, "children"> {
  onClick?: () => void
}

const Tooltip: FC<Props> = ({ className, onClick, children, ...props }) => {
  const button = (
    <button
      type="button"
      className={classNames(styles.button, className)}
      onClick={onClick}
    >
      {children}
    </button>
  )

  return props.content ? (
    <Tippy
      {...TooltipTippyProps}
      {...props}
      hideOnClick={isNil(props.visible) ? false : undefined}
    >
      {button}
    </Tippy>
  ) : (
    button
  )
}

export const TooltipIcon: FC<Props> = ({ children, ...props }) => (
  <div className={styles.flex}>
    {children}
    <div className={styles.icon}>
      <Tooltip {...props}>
        <Icon name="InfoCircle" size={16} />
      </Tooltip>
    </div>
  </div>
)

export default Tooltip

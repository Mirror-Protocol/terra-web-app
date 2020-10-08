import React, { ReactNode } from "react"
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
}

const TooltipTippyProps: TippyProps = {
  ...DefaultTippyProps,
  placement: "bottom",
}

interface Props extends TippyProps {
  icon?: boolean
  onClick?: () => void
}

const Tooltip = ({ icon, className, onClick, children, ...props }: Props) => {
  const render = (children: ReactNode) => (
    <Tippy
      {...TooltipTippyProps}
      {...props}
      theme="light-border"
      hideOnClick={isNil(props.visible) ? false : undefined}
      className={styles.tooltip}
    >
      <button
        className={classNames(styles.button, className)}
        onClick={onClick}
      >
        {children}
      </button>
    </Tippy>
  )

  return !icon ? (
    render(children)
  ) : (
    <div className={styles.flex}>
      {children}
      <div className={styles.icon}>
        {render(<Icon name="info_outline" size={16} />)}
      </div>
    </div>
  )
}

export default Tooltip

import React, { PropsWithChildren } from "react"
import classNames from "classnames"
import styles from "./Badge.module.scss"

const Badge: React.FC<PropsWithChildren<{ className?: string }>> = ({
  className,
  children,
}) => <span className={classNames(styles.badge, className)}>{children}</span>

export default Badge

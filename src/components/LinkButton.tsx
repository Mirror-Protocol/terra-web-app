import React from "react"
import { Link, LinkProps as Props } from "react-router-dom"
import { getAttrs } from "./Button"
import styles from "./Button.module.scss"

export type LinkProps = ButtonProps & Props
const LinkButton = (props: LinkProps) =>
  props.disabled ? (
    <span {...getAttrs(props)} />
  ) : (
    <div className={styles.middle}>
      <Link {...getAttrs(props)} />
    </div>
  )

export default LinkButton

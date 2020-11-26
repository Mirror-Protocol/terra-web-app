import { Link, LinkProps as Props } from "react-router-dom"
import { getAttrs } from "./Button"

export type LinkProps = ButtonProps & Props
const LinkButton = (props: LinkProps) =>
  props.disabled ? <span {...getAttrs(props)} /> : <Link {...getAttrs(props)} />

export default LinkButton

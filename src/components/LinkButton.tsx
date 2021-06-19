import { Link, LinkProps as Props } from "react-router-dom"
import { ButtonInterface, getAttrs } from "./Button"

export type LinkProps = ButtonInterface & Props
const LinkButton = (props: LinkProps) => {
  const { children, ...attrs } = getAttrs(props)

  return props.disabled ? (
    <a {...attrs}>{children}</a>
  ) : (
    <Link {...attrs}>{children}</Link>
  )
}

export default LinkButton

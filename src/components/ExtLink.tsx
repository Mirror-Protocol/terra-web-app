import { AnchorHTMLAttributes } from "react"

export type Props = AnchorHTMLAttributes<HTMLAnchorElement>
const ExtLink = ({ children, ...attrs }: Props) => (
  <a {...attrs} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

export default ExtLink

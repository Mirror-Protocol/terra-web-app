import { ButtonInterface, getAttrs } from "./Button"
import ExtLink, { Props as ExtLinkProps } from "./ExtLink"

export type Props = ButtonInterface & ExtLinkProps
const ExtLinkButton = (props: Props) => <ExtLink {...getAttrs(props)} />

export default ExtLinkButton

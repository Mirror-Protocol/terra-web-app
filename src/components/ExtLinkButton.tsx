import { getAttrs } from "./Button"
import ExtLink, { Props as ExtLinkProps } from "./ExtLink"

export type Props = ButtonProps & ExtLinkProps
const ExtLinkButton = (props: Props) => <ExtLink {...getAttrs(props)} />

export default ExtLinkButton

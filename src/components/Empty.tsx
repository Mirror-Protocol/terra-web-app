import { FC } from "react"
import Card from "./Card"

const Empty: FC = ({ children }) => (
  <Card>
    <p className="empty">{children}</p>
  </Card>
)

export default Empty

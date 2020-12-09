import { FC } from "react"
import Card from "./Card"

const Empty: FC = ({ children }) => (
  <Card>
    <section className="empty">{children}</section>
  </Card>
)

export default Empty

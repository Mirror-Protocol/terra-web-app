import { NavLink } from "react-router-dom"
import Boundary from "../components/Boundary"
import ConnectButton from "../components/ConnectButton"
import { getPath, MenuKey } from "../routes"
import Balance from "./Balance"
import styles from "./Connected.module.scss"

const Connected = ({ className }: { className?: string }) => {
  return (
    <NavLink className={className} to={getPath(MenuKey.MY)}>
      <ConnectButton>
        <div className={styles.button}>
          <Boundary>
            <Balance />
          </Boundary>
        </div>
      </ConnectButton>
    </NavLink>
  )
}

export default Connected

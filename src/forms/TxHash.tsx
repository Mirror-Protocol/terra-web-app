import { useNetwork } from "../hooks"
import TxLink from "../components/TxLink"

const TxHash = ({ children: hash }: { children: string }) => {
  const { finder } = useNetwork()
  return <TxLink hash={hash} link={finder(hash, "tx")} />
}

export default TxHash

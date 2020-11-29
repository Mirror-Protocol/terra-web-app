import { useState } from "react"
import { useQuery } from "@apollo/client"
import useStatsClient from "./useStatsClient"
import { useWallet } from "../hooks/useWallet"
import AIRDROP from "../airdrop/gqldocs"

export default () => {
  const [airdrop, setAirdrop] = useState<Airdrop[]>()
  const { address } = useWallet()
  const client = useStatsClient()

  useQuery<{ airdrop: Airdrop[] }>(AIRDROP, {
    variables: { address },
    client,
    onCompleted: ({ airdrop }) => setAirdrop(airdrop),
  })

  return airdrop
}

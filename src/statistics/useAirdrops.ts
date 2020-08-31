import { useState } from "react"
import { useQuery } from "@apollo/client"
import { sum } from "../libs/math"
import { useWallet } from "../hooks/useWallet"
import AIRDROP from "../airdrop/gqldocs"
import useStatsClient from "./useStatsClient"

export default () => {
  const [airdrop, setAirdrop] = useState<Airdrop[]>()
  const { address } = useWallet()
  const client = useStatsClient()
  const amount = sum(airdrop?.map(({ amount }) => amount) ?? [])

  const { loading } = useQuery<{ airdrop: Airdrop[] }>(AIRDROP, {
    variables: { address },
    client,
    onCompleted: ({ airdrop }) => setAirdrop(airdrop),
  })

  return { airdrop, loading, amount }
}

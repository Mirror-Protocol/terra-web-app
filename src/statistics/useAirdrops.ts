import { useState } from "react"
import { useQuery } from "@apollo/client"
import { gt, sum } from "../libs/math"
import { useWallet } from "../hooks/useWallet"
import AIRDROP from "../airdrop/gqldocs"
import useStatsClient from "./useStatsClient"

export default () => {
  const [airdropList, setAirdropList] = useState<Airdrop[]>()
  const { address } = useWallet()
  const client = useStatsClient()

  const { loading } = useQuery<{ airdrop: Airdrop[] }>(AIRDROP, {
    variables: { address },
    client,
    onCompleted: ({ airdrop }) =>
      setAirdropList(airdrop.filter(({ amount }) => gt(amount, 0))),
  })

  const airdrop = airdropList?.slice(0, 1)
  const amount = sum(airdrop?.map(({ amount }) => amount) ?? [])

  return { airdrop, loading, amount }
}

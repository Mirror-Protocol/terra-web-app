import { useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { useStatsClient } from "./useStats"
import { useWallet } from "../hooks/useWallet"

const AIRDROP = gql`
  query airdrop($address: String!) {
    airdrop(address: $address)
  }
`

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

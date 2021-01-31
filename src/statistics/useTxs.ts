import { useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { useWallet } from "../hooks"
import useStatsClient from "./useStatsClient"

const LIMIT = 30

const TXS = gql`
  query txs($account: String!, $offset: Float, $limit: Float) {
    txs(account: $account, offset: $offset, limit: $limit) {
      createdAt
      id
      height
      txHash
      address
      type
      data
      token
      datetime
      fee
      tags
      memo
    }
  }
`

const useTxs = () => {
  const [offset, setOffset] = useState(0)
  const [txs, setTxs] = useState<Tx[]>([])
  const [done, setDone] = useState(true)

  const client = useStatsClient()
  const { address } = useWallet()
  const query = useQuery<{ txs: Tx[] }>(TXS, {
    client,
    variables: { account: address, offset, limit: LIMIT },
    onCompleted: ({ txs }) => {
      setTxs((prev) => [...prev, ...txs])
      setDone(txs.length < LIMIT)
    },
  })

  const more = done ? undefined : () => setOffset((n) => n + LIMIT)

  return { ...query, txs, more }
}

export default useTxs

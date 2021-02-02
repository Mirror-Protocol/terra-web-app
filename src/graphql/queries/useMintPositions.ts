import { last } from "ramda"
import { useEffect, useState } from "react"
import { useContractsAddress, useWallet } from "../../hooks"
import useContractQuery from "../useContractQuery"

const LIMIT = 30

export default () => {
  const [positions, setPositions] = useState<MintPosition[]>([])
  const [offset, setOffset] = useState<string>()
  const [done, setDone] = useState(true)

  const { address } = useWallet()
  const { contracts } = useContractsAddress()
  const variables = {
    contract: contracts["mint"],
    msg: {
      positions: { owner_addr: address, limit: LIMIT, start_after: offset },
    },
  }

  const query = useContractQuery<MintPositions>(variables)
  const { parsed } = query

  useEffect(() => {
    if (parsed) {
      setPositions((prev) => [...prev, ...parsed.positions])
      setDone(parsed.positions.length < LIMIT)
    }

    // eslint-disable-next-line
  }, [JSON.stringify(parsed)])

  const more = done ? undefined : () => setOffset(last(positions)?.idx)

  return { ...query, positions, more }
}

import { useEffect } from "react"
import { useMutation } from "@apollo/client"
import { CONNECT } from "../statistics/gqldocs"
import useStatsClient from "../statistics/useStatsClient"
import useNetwork from "./useNetwork"

/* graph */
const useConnectGraph = (address: string) => {
  const { stats } = useNetwork()
  const client = useStatsClient()
  const [connectToGraph] = useMutation(CONNECT, { client })

  useEffect(() => {
    address && stats && connectToGraph({ variables: { address } })
  }, [address, stats, connectToGraph])
}

export default useConnectGraph

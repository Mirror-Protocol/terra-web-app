import { useEffect } from "react"
import { useRecoilValue } from "recoil"
import { gql, request } from "graphql-request"
import { statsURLQuery } from "../data/network"
import useAddress from "./useAddress"

export const CONNECT = gql`
  mutation connect($address: String!) {
    connect(address: $address) {
      address
    }
  }
`

const useConnectGraph = () => {
  const url = useRecoilValue(statsURLQuery)
  const address = useAddress()

  useEffect(() => {
    const mutate = async () => {
      await request(url + "?connect", CONNECT, { address })
    }

    address && mutate()
  }, [address, url])
}

export default useConnectGraph

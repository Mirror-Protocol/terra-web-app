import { gql, request } from "graphql-request"
import { selector } from "recoil"
import { mantleURLQuery } from "../network"

const TXINFOS = gql`
  query TxInfos($hash: String) {
    TxInfos(TxHash: $hash) {
      Height
      TxHash
      Success
      RawLog

      Tx {
        Fee {
          Amount {
            Amount
            Denom
          }
        }
        Memo
      }

      Logs {
        Events {
          Type
          Attributes {
            Key
            Value
          }
        }
      }
    }
  }
`

export const getTxInfosQuery = selector({
  key: "getTxInfos",
  get: ({ get }) => {
    const url = get(mantleURLQuery)
    return async (hash: string) => {
      const data = await request<TxInfos>(url + "?TxInfos", TXINFOS, { hash })
      return data.TxInfos[0]
    }
  },
})

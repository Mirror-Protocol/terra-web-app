import { gql } from "@apollo/client"

export const WASMQUERY = "WasmContractsContractAddressStore"

export const getContract = (name: string) => gql`
  query ${name} ($contract: String, $msg: String) {
    WasmContractsContractAddressStore(
      ContractAddress: $contract
      QueryMsg: $msg
    ) {
      Height
      Result
    }
  }
`

export const TAX = gql`
  query tax {
    TreasuryTaxRate {
      Result
    }

    TreasuryTaxCapDenom(Denom: "uusd") {
      Result
    }
  }
`

export const TXINFOS = gql`
  query txInfos($hash: String) {
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

import { gql } from "@apollo/client"

export const WASMQUERY = "WasmContractsContractAddressStore"

export const CONTRACT = gql`
  query($contract: String, $msg: String) {
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
  query {
    TreasuryTaxRate {
      Result
    }

    TreasuryTaxCapDenom(Denom: "uusd") {
      Result
    }
  }
`

export const TXINFOS = gql`
  query($hash: String) {
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

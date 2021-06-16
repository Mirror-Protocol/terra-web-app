import { gql } from "graphql-request"

export const BANK_BALANCES_ADDRESS = gql`
  query BankBalancesAddress($address: String) {
    BankBalancesAddress(Address: $address) {
      Result {
        Amount
        Denom
      }
    }
  }
`

export const ORACLE_DENOMS_EXCHANGE_RATES = gql`
  query OracleDenomsExchangeRates {
    OracleDenomsExchangeRates {
      Height
      Result {
        Amount
        Denom
      }
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

export const WASM = gql`
  query WasmContractsContractAddressStore($contract: String, $msg: String) {
    WasmContractsContractAddressStore(
      ContractAddress: $contract
      QueryMsg: $msg
    ) {
      Height
      Result
    }
  }
`

export const TX_INFOS = gql`
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

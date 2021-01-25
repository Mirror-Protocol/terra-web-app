import { gql } from "@apollo/client"

export const CONNECT = gql`
  mutation connect($address: String!) {
    connect(address: $address) {
      address
    }
  }
`

export const STATISTICS = gql`
  query statistic($from: Float!, $to: Float!, $network: Network) {
    statistic(network: $network) {
      assetMarketCap
      totalValueLocked
      collateralRatio
      mirCirculatingSupply
      govAPR
      govAPY

      latest24h {
        transactions
        volume
        feeVolume
        mirVolume
      }

      liquidityHistory(from: $from, to: $to) {
        timestamp
        value
      }

      tradingVolumeHistory(from: $from, to: $to) {
        timestamp
        value
      }
    }
  }
`

export const ASSETSTATS = gql`
  query assets($network: Network) {
    assets {
      token
      description
      statistic {
        liquidity(network: $network)
        volume(network: $network)
        apr
        apy
      }
    }
  }
`

export const PRICEHISTORY = gql`
  query asset(
    $token: String!
    $interval: Float!
    $from: Float!
    $to: Float!
    $yesterday: Float!
  ) {
    asset(token: $token) {
      prices {
        price
        priceAt(timestamp: $yesterday)

        history(interval: $interval, from: $from, to: $to) {
          timestamp
          price
        }
      }
    }
  }
`

const alias = (
  token: string,
  timestamp: number
) => `${token}: asset(token: "${token}") {
      prices {
        priceAt(timestamp: ${timestamp})
        oraclePriceAt(timestamp: ${timestamp})
      }
    }`

export const prices = (tokens: string[], timestamp: number) => gql`
  query {
    ${tokens.map((token) => alias(token, timestamp))}
  }
`

import { gql } from "graphql-request"

export const ACCOUNT = gql`
  query account($address: String!) {
    account(address: $address) {
      accumulatedGovReward
      voteHistory {
        pollId
        amount
        voteOption
      }
    }
  }
`

export const TXS = gql`
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
      memo
    }
  }
`

export const AIRDROP = gql`
  query airdrop($address: String!, $network: String = "TERRA") {
    airdrop(address: $address, network: $network)
  }
`

export const ASSET = gql`
  query asset($token: String!, $from: Float!, $to: Float!, $interval: Float!) {
    asset(token: $token) {
      prices {
        history(interval: $interval, from: $from, to: $to) {
          timestamp
          price
        }
      }
    }
  }
`

export const ASSETS = {
  STATS: gql`
    query assets($network: Network) {
      assets {
        token
        description

        prices {
          price
          oraclePrice
        }

        statistic {
          liquidity(network: $network)
          volume(network: $network)
          marketCap
          collateralValue
          minCollateralRatio
          apr {
            long
            short
          }
        }
      }
    }
  `,

  PRICES: gql`
    query assets($timestamp: Float!) {
      assets {
        token
        prices {
          price
          priceAt(timestamp: $timestamp)
          oraclePrice
          oraclePriceAt(timestamp: $timestamp)
        }
      }
    }
  `,

  HISTORY: gql`
    query assets($interval: Float!, $from: Float!, $to: Float!) {
      assets {
        token
        prices {
          history(interval: $interval, from: $from, to: $to) {
            timestamp
            price
          }
        }
      }
    }
  `,
}

export const STATISTIC = {
  DASHBOARD: gql`
    query statistic($network: Network) {
      statistic(network: $network) {
        mirPrice
        assetMarketCap
        govAPR

        mirSupply {
          circulating
          liquidity
          staked
        }

        totalValueLocked {
          total
          liquidity
          collateral
          stakedMir
        }

        latest24h {
          transactions
          volume
          feeVolume
        }
      }
    }
  `,

  HISTORY: gql`
    query statistic($from: Float!, $to: Float!, $network: Network) {
      statistic(network: $network) {
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
  `,
}

export const CDPS = gql`
  query cdps($tokens: [String!]) {
    cdps(maxRatio: 9999, tokens: $tokens) {
      id
      address
      token
      mintAmount
      collateralToken
      collateralAmount
      collateralRatio
    }
  }
`

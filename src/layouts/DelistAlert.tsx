import { uniq } from "ramda"
import { selector, useRecoilValue } from "recoil"
import { gt } from "../libs/math"
import { protocolQuery, useProtocol } from "../data/contract/protocol"
import { tokenBalancesQuery } from "../data/contract/normalize"
import { mintPositionsQuery } from "../data/contract/positions"
import { stakingRewardInfoQuery } from "../data/contract/contract"
import { limitOrdersQuery } from "../data/contract/orders"
import DelistModal from "./DelistModal"

const holdingTokensQuery = selector({
  key: "holdingTokens",
  get: ({ get }) => {
    const tokenBalances = get(tokenBalancesQuery)
    return Object.keys(tokenBalances).filter((token) =>
      gt(tokenBalances[token], 0)
    )
  },
})

const mintTokensQuery = selector({
  key: "mintTokens",
  get: ({ get }) => {
    const { parseAssetInfo } = get(protocolQuery)
    const mintPositions = get(mintPositionsQuery) ?? []
    const collateral = mintPositions.map(
      (position) => parseAssetInfo(position.collateral.info).token
    )

    const asset = mintPositions.map(
      (position) => parseAssetInfo(position.asset.info).token
    )

    return uniq([...collateral, ...asset])
  },
})

const stakingTokensQuery = selector({
  key: "stakingTokens",
  get: ({ get }) => {
    const stakingRewardInfo = get(stakingRewardInfoQuery)
    return (
      stakingRewardInfo?.reward_infos.map(({ asset_token }) => asset_token) ??
      []
    )
  },
})

const limitOrderQuery = selector({
  key: "limitOrder",
  get: ({ get }) => {
    const { parseAssetInfo } = get(protocolQuery)
    const limitOrders = get(limitOrdersQuery) ?? []
    return limitOrders.map(
      ({ ask_asset }) => parseAssetInfo(ask_asset.info).token
    )
  },
})

const DelistAlert = () => {
  const { delist } = useProtocol()
  const filter = (token: string) => !!delist[token]

  const delistedHolding = useRecoilValue(holdingTokensQuery)
  const delistedMint = useRecoilValue(mintTokensQuery)
  const delistedStaking = useRecoilValue(stakingTokensQuery)
  const delistedLimitOrder = useRecoilValue(limitOrderQuery)

  const delistedTokens = uniq([
    ...delistedHolding,
    ...delistedMint,
    ...delistedStaking,
    ...delistedLimitOrder,
  ]).filter(filter)

  return delistedTokens.length ? <DelistModal tokens={delistedTokens} /> : null
}

export default DelistAlert

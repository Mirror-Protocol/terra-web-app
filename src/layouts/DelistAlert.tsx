import { uniq } from "ramda"
import { gt } from "../libs/math"
import { useProtocol } from "../data/contract/protocol"
import { useTokenBalances } from "../data/contract/normalize"
import { useMintPositions } from "../data/contract/positions"
import { useStakingRewardInfo } from "../data/contract/contract"
import { useLimitOrders } from "../data/contract/orders"
import DelistModal from "./DelistModal"

const useHoldingTokens = () => {
  const tokenBalances = useTokenBalances()
  return Object.keys(tokenBalances).filter((token) =>
    gt(tokenBalances[token], 0)
  )
}

const useMintTokens = () => {
  const { parseAssetInfo } = useProtocol()
  const mintPositions = useMintPositions()
  const collateral = mintPositions.map(
    (position) => parseAssetInfo(position.collateral.info).token
  )

  const asset = mintPositions.map(
    (position) => parseAssetInfo(position.asset.info).token
  )

  return uniq([...collateral, ...asset])
}

const useStakingTokens = () => {
  const stakingRewardInfo = useStakingRewardInfo()
  return (
    stakingRewardInfo?.reward_infos.map(({ asset_token }) => asset_token) ?? []
  )
}

const useLimitOrder = () => {
  const { parseAssetInfo } = useProtocol()
  const limitOrders = useLimitOrders()
  return limitOrders.map(
    ({ ask_asset }) => parseAssetInfo(ask_asset.info).token
  )
}

const DelistAlert = () => {
  const { delist } = useProtocol()
  const filter = (token: string) => !!delist[token]

  const delistedHolding = useHoldingTokens()
  const delistedMint = useMintTokens()
  const delistedStaking = useStakingTokens()
  const delistedLimitOrder = useLimitOrder()

  const delistedTokens = uniq([
    ...delistedHolding,
    ...delistedMint,
    ...delistedStaking,
    ...delistedLimitOrder,
  ]).filter(filter)

  return delistedTokens.length ? <DelistModal tokens={delistedTokens} /> : null
}

export default DelistAlert

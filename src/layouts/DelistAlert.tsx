import { uniq } from "ramda"
import { useContractsAddress } from "../hooks"
import useMy from "../pages/My/useMy"
import DelistModal from "./DelistModal"

const DelistAlert = () => {
  const { delist } = useContractsAddress()
  const filter = <T extends { token: string }>({ token }: T) => !!delist[token]

  const my = useMy()
  const { holdings, mint, pool, stake, orders } = my

  const delistedHoldings = holdings.dataSource.filter(filter).map(getToken)

  const delistedMintTokens = mint.dataSource.reduce<string[]>(
    (acc, { collateral, asset }) =>
      acc
        .concat(delist[collateral.token] ? collateral.token : [])
        .concat(delist[asset.token] ? asset.token : []),
    []
  )

  const delistedPoolTokens = pool.dataSource.filter(filter).map(getToken)
  const delistedStakedTokens = stake.dataSource.filter(filter).map(getToken)
  const delistedOrderTokens = orders.dataSource.filter(filter).map(getToken)

  const delistedTokens = uniq([
    ...delistedHoldings,
    ...delistedMintTokens,
    ...delistedPoolTokens,
    ...delistedStakedTokens,
    ...delistedOrderTokens,
  ])

  return delistedTokens.length ? <DelistModal tokens={delistedTokens} /> : null
}

export default DelistAlert

/* helpers */
const getToken = <T extends { token: string }>({ token }: T) => token

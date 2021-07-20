import { uniq } from "ramda"
import { useProtocol } from "../data/contract/protocol"
import { useMyTotal } from "../data/my/total"
import DelistModal from "./DelistModal"

const DelistAlert = () => {
  const { delist } = useProtocol()
  const filter = (token: string) => !!delist[token]

  const { holding, borrowing, farming, short, limitOrder } = useMyTotal()

  const delistedTokens = uniq([
    ...holding.dataSource.map(({ token }) => token),
    ...borrowing.dataSource.map(({ collateralAsset }) => collateralAsset.token),
    ...borrowing.dataSource.map(({ mintedAsset }) => mintedAsset.token),
    ...farming.dataSource.map(({ token }) => token),
    ...short.dataSource.map(({ token }) => token),
    ...limitOrder.dataSource.map(({ token }) => token),
  ]).filter(filter)

  return delistedTokens.length ? <DelistModal tokens={delistedTokens} /> : null
}

export default DelistAlert

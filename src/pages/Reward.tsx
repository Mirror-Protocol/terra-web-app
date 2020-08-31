import useHash from "../libs/useHash"
import Page from "../components/Page"
import RewardForm from "../forms/RewardForm"
import useContractQueries from "../graphql/useContractQueries"
import { dict } from "../graphql/useNormalize"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey, PriceKey } from "../hooks/contractKeys"

export enum Type {
  "FACTORY" = "factory",
  "COLLECTOR" = "gov",
}

const Reward = () => {
  const { hash: type } = useHash<Type>(Type.FACTORY)
  const tab = { tabs: [Type.FACTORY, Type.COLLECTOR], current: type }

  /* initialize form */
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.LPSTAKED

  const { [balanceKey]: balances } = useContract()
  useRefetch([priceKey, balanceKey])
  const collected = useCollected()
  const payload = {
    [Type.FACTORY]: balances,
    [Type.COLLECTOR]: collected,
  }[type]

  return (
    <Page title="Reward">
      {type && payload && (
        <RewardForm balances={payload} type={type} tab={tab} key={type} />
      )}
    </Page>
  )
}

export default Reward

/* hooks */
const useCollected = () => {
  const { contracts } = useContractsAddress()
  const { parsed } = useContractQueries<Balance>(({ token }) => ({
    contract: token,
    msg: { balance: { address: contracts["collector"] } },
  }))

  return parsed && dict(parsed, ({ balance }) => balance)
}

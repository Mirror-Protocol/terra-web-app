import { useState } from "react"
import classNames from "classnames/bind"
import { gt } from "../libs/math"
import { useProtocol } from "../data/contract/protocol"
import { BalanceKey, PriceKey } from "../hooks/contractKeys"
import { useFind } from "../data/contract/normalize"
import Icon from "../components/Icon"
import { Config } from "./useSelectAsset"
import Asset from "./Asset"
import styles from "./Assets.module.scss"

const cx = classNames.bind(styles)

interface Props extends Config {
  selected?: string
  onSelect: (token: string) => void
}

const Assets = ({ selected, onSelect, ...props }: Props) => {
  const { native = [], showDelisted, showExternal } = props
  const { getPriceKey, priceKey, balanceKey } = props
  const { validate, dim, formatTokenName } = props

  const { listedAll, listedAllExternal, getIsDelisted } = useProtocol()
  const find = useFind()

  /* search */
  const [value, setValue] = useState("")

  const nativeDenoms: Dictionary<AssetItemProps> = {
    uusd: {
      token: "uusd",
      symbol: "uusd",
      name: "UST",
      price:
        priceKey || getPriceKey ? find(PriceKey.NATIVE, "uusd") : undefined,
      balance: balanceKey ? find(BalanceKey.NATIVE, "uusd") : undefined,
    },
    uluna: {
      token: "uluna",
      symbol: "uluna",
      name: "Luna",
      price:
        priceKey || getPriceKey ? find(PriceKey.NATIVE, "uluna") : undefined,
      balance: balanceKey ? find(BalanceKey.NATIVE, "uluna") : undefined,
    },
  }

  /* list */
  const list: AssetItemProps[] = [
    ...native.map((denom) => nativeDenoms[denom]),
    ...[
      ...listedAllExternal.filter(() => !!showExternal),
      ...listedAll.filter(({ token }) =>
        showDelisted && balanceKey
          ? !getIsDelisted(token) || gt(find(balanceKey, token), 0)
          : !getIsDelisted(token)
      ),
    ]
      .filter((item) => !validate || validate?.(item))
      .map((item) => ({
        ...item,
        price: getPriceKey
          ? find(getPriceKey(item.token), item.token)
          : priceKey
          ? find(priceKey, item.token)
          : undefined,
        balance: balanceKey && find(balanceKey, item.token),
      })),
  ]

  return (
    <div className={styles.component}>
      <section className={styles.search}>
        <label htmlFor="search">
          <Icon name="Search" size={16} />
        </label>

        <input
          id="search"
          name="search"
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoFocus
        />
      </section>

      <ul className={styles.list}>
        {list
          .filter(({ symbol, name }) =>
            // search result
            [symbol, name].some((text) =>
              text?.toLowerCase().includes(value.toLowerCase())
            )
          )
          .sort(({ token: a }, { token: b }) => {
            const hasA = balanceKey && gt(find(balanceKey, a), 0) ? 1 : 0
            const hasB = balanceKey && gt(find(balanceKey, b), 0) ? 1 : 0
            return hasB - hasA
          })
          .map((item) => {
            const { token } = item
            const isSelected = token === selected
            const isDimmed = dim?.(token)

            return (
              <li key={token}>
                <button
                  type="button"
                  className={cx(styles.button, {
                    selected: isSelected,
                    dim: isDimmed,
                  })}
                  onClick={() => onSelect(token)}
                >
                  <Asset {...item} formatTokenName={formatTokenName} />
                </button>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default Assets

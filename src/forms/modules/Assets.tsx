import { useState } from "react"
import classNames from "classnames/bind"
import { gt } from "../../libs/math"
import { useProtocol } from "../../data/contract/protocol"
import { PriceKey } from "../../hooks/contractKeys"
import { useFindBalance } from "../../data/contract/normalize"
import { useFindPrice } from "../../data/contract/normalize"
import Icon from "../../components/Icon"
import { Config } from "./useSelectAsset"
import Asset, { AssetItemProps } from "./Asset"
import styles from "./Assets.module.scss"

const cx = classNames.bind(styles)

interface Props extends Config {
  selected?: string
  onSelect: (token: string) => void
}

const getSymbolIndex = (symbol: string) => {
  const indexes = ["uusd", "aUST", "uluna", "MIR", "ANC"]
  return indexes.includes(symbol) ? indexes.indexOf(symbol) : indexes.length
}

const Assets = ({ selected, onSelect, ...props }: Props) => {
  const { native = [], showDelisted, showExternal } = props
  const { getPriceKey, priceKey } = props
  const { validate, dim, formatTokenName } = props

  const { listedAll, listedAllExternal, getIsDelisted } = useProtocol()
  const { contents: findBalance } = useFindBalance()
  const findPrice = useFindPrice()

  /* search */
  const [value, setValue] = useState("")

  const nativeDenoms: Dictionary<AssetItemProps> = {
    uusd: {
      token: "uusd",
      symbol: "uusd",
      name: "UST",
      price:
        priceKey || getPriceKey
          ? findPrice(PriceKey.NATIVE, "uusd")
          : undefined,
      balance: findBalance("uusd"),
    },
    uluna: {
      token: "uluna",
      symbol: "uluna",
      name: "Luna",
      price:
        priceKey || getPriceKey
          ? findPrice(PriceKey.NATIVE, "uluna")
          : undefined,
      balance: findBalance("uluna"),
    },
  }

  /* list */
  const list: AssetItemProps[] = [
    ...native.map((denom) => nativeDenoms[denom]),
    ...[
      ...listedAllExternal.filter(() => !!showExternal),
      ...listedAll.filter(({ token }) =>
        showDelisted
          ? !getIsDelisted(token) || gt(findBalance(token), 0)
          : !getIsDelisted(token)
      ),
    ]
      .filter((item) => !validate || validate?.(item))
      .map((item) => ({
        ...item,
        price: getPriceKey
          ? findPrice(getPriceKey(item.token), item.token)
          : priceKey
          ? findPrice(priceKey, item.token)
          : undefined,
        balance: findBalance(item.token),
      })),
  ].sort(
    ({ symbol: a }, { symbol: b }) => getSymbolIndex(a) - getSymbolIndex(b)
  )

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
            const hasA = gt(findBalance(a), 0) ? 1 : 0
            const hasB = gt(findBalance(b), 0) ? 1 : 0
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

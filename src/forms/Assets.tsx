import { useState } from "react"
import classNames from "classnames/bind"
import { UST, UUSD } from "../constants"
import { gt } from "../libs/math"
import { insertIf } from "../libs/utils"
import { useContractsAddress, useContract, useCombineKeys } from "../hooks"
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
  const { priceKey, balanceKey } = props
  const { useUST, skip, dim, formatTokenName } = props

  const { listed } = useContractsAddress()
  const { uusd, find } = useContract()
  const { loading } = useCombineKeys([priceKey, balanceKey])

  /* search */
  const [value, setValue] = useState("")

  /* list */
  const list: AssetItem[] = [
    ...insertIf(useUST, {
      token: UUSD,
      symbol: UUSD,
      name: UST,
      price: "1",
      balance: uusd,
    }),
    ...listed
      .filter(({ symbol }) => !skip?.includes(symbol))
      .map((item) => ({
        ...item,
        price: priceKey && find(priceKey, item.token),
        balance: balanceKey && find(balanceKey, item.token),
      })),
  ]

  return (
    <div className={styles.component}>
      <section className={styles.search}>
        <label htmlFor="search">
          <Icon name="search" size={16} />
        </label>

        <input
          id="search"
          name="search"
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoFocus
        />
      </section>

      <ul className={classNames(styles.list, { loading })}>
        {list
          .filter(({ symbol, name }) =>
            // search result
            [symbol, name].some((text) =>
              text.toLowerCase().includes(value.toLowerCase())
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

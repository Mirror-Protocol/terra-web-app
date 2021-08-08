import React, { FC, useEffect, useState } from "react"
import classNames from "classnames/bind"
import styles from "./FeeCombobox.module.scss"
import { NATIVE_TOKENS } from "constants/constants"
import Icon from "components/Icon"
import { tokenInfos } from "rest/usePairs"

const cx = classNames.bind(styles)

interface Props {
  selected?: string
  onSelect: (asset: string) => void
}

const FeeCombobox: FC<Props> = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(selected)

  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = (value: string) => {
    setSelectedOption(value)
    const tokenInfo = tokenInfos.get(value)
    onSelect(tokenInfo ? tokenInfo.symbol : "")
    setIsOpen(false)
  }

  useEffect(() => {
    const handleWindowClick = () => {
      setIsOpen(false)
    }
    if (isOpen) {
      window.addEventListener("click", handleWindowClick)
    }
    return () => {
      window.removeEventListener("click", handleWindowClick)
    }
  }, [isOpen])

  return (
    <div className={cx(styles.body)}>
      <div className={cx(styles.label)}>Fee:</div>
      <div className={cx(styles.container)} onClick={toggling}>
        <div
          className={[
            cx(styles.header),
            isOpen ? cx(styles["header--open"]) : "",
          ].join(" ")}
        >
          <div>
            {selectedOption ? tokenInfos.get(selectedOption)?.symbol : ""}
          </div>
          <Icon name={isOpen ? "expand_less" : "expand_more"} size={24} />
        </div>
        {isOpen && (
          <div className={cx(styles.listcontainer)}>
            <ul className={cx(styles.list)}>
              {NATIVE_TOKENS.filter((value) => {
                if (
                  tokenInfos.get(value)?.name === selectedOption ||
                  tokenInfos.get(value)?.symbol === selectedOption
                ) {
                  return false
                }
                return true
              }).map((value) => {
                return (
                  <li
                    key={value}
                    className={styles.listitem}
                    onClick={() => onOptionClicked(value)}
                  >
                    {tokenInfos.get(value)?.symbol}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeeCombobox

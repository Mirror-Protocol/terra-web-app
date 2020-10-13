import React, { useState } from "react"
import classNames from "classnames"
import { MIR } from "../../constants"
import { ReactComponent as MirrorSymbol } from "../../images/MIR.svg"
import USTIcon from "../../images/UST.png"
import styles from "./StakeImage.module.scss"

interface Props {
  symbol: string
  bg?: string
}

const StakeImage = ({ symbol, bg = "bg" }: Props) => {
  const [notFound, setNotFound] = useState(false)
  const size = { width: 25, height: 25 }

  return (
    <section className={styles.images}>
      <div className={classNames(styles.fill, "bg-" + bg)}>
        {notFound ? (
          <strong className={styles.text}>{getName(symbol)}</strong>
        ) : symbol === MIR ? (
          <MirrorSymbol {...size} />
        ) : (
          <img
            {...size}
            src={`${process.env.PUBLIC_URL}/logo/${symbol}.png`}
            onError={() => setNotFound(true)}
            alt=""
          />
        )}
      </div>

      <div className={styles.outline}>
        <img src={USTIcon} width={25} height={25} alt="" />
      </div>
    </section>
  )
}

export default StakeImage

/* helpers */
const getName = (symbol: string) =>
  symbol.startsWith("m") ? symbol.slice(1) : symbol

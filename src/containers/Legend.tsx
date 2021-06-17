import { FC, ReactNode } from "react"
import styles from "./Legend.module.scss"

const $blue = "#66adff"
const $blue62 = "#55779d"
const $blue38 = "#4a5460"
const $gray24 = "#3d3d3d"
const $gray14 = "#242424"
const $gray08 = "#141414"
const $white44 = "#707070"

export const colors = [
  $blue,
  $blue62,
  $blue38,
  $gray24,
  $gray14,
  $gray08,
  $white44,
]

interface Props {
  index: number
  label: ReactNode
}

const Legend: FC<Props> = ({ index, label, children }) => {
  return (
    <>
      <header className={styles.header}>
        <div
          className={styles.square}
          style={{ backgroundColor: colors[index] }}
        />
        <h1 className={styles.label}>{label}</h1>
      </header>

      <p className={styles.value}>{children}</p>
    </>
  )
}

export default Legend

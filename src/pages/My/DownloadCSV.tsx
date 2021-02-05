import Tippy from "@tippyjs/react"
import useDownloadCSV from "../../statistics/useDownloadCSV"
import { DropdownTippyProps } from "../../components/Tooltip"
import { getAttrs } from "../../components/Button"
import Dropdown from "../../components/Dropdown"
import ExtLink from "../../components/ExtLink"

const button: ButtonProps = {
  className: "desktop",
  color: "aqua",
  size: "sm",
  outline: true,
}

const DownloadCSV = ({ txs }: { txs: Tx[] }) => {
  const list = useDownloadCSV(txs)
  const links = list.map(({ children, href, count }) => {
    const label = `${children} (${count})`
    return count ? (
      <ExtLink href={href} download={`${children}.csv`}>
        {label}
      </ExtLink>
    ) : (
      <span>{label}</span>
    )
  })

  return (
    <Tippy {...DropdownTippyProps} render={() => <Dropdown list={links} />}>
      <button {...getAttrs(button)}>Download CSV</button>
    </Tippy>
  )
}

export default DownloadCSV

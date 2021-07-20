import Tippy from "@tippyjs/react"
import useDownloadCSV from "../../hooks/useDownloadCSV"
import { DropdownTippyProps } from "../../components/Tooltip"
import Dropdown from "../../components/Dropdown"
import ExtLink from "../../components/ExtLink"
import { CaptionAction } from "../../components/Caption"

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
      <CaptionAction className="desktop">Download CSV</CaptionAction>
    </Tippy>
  )
}

export default DownloadCSV

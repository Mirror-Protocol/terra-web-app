import { useLocation } from "react-router-dom"
import useHash from "../../libs/useHash"
import { useMintPosition } from "../../data/contract/position"
import { useProtocol } from "../../data/contract/protocol"
import Page from "../../components/Page"
import Tab from "../../components/Tab"
import { MintType } from "../../types/Types"
import MintForm from "../../forms/MintForm"

const Mint = () => {
  const { hash: type } = useHash<MintType>()
  const { search } = useLocation()
  const idx = new URLSearchParams(search).get("idx") || undefined

  const parsed = useMintPosition(idx)
  const invalid = Boolean(idx && !parsed)

  const { parseAssetInfo, getIsDelisted } = useProtocol()
  const isAssetDelisted =
    parsed && getIsDelisted(parseAssetInfo(parsed.asset.info).token)

  return (
    <Page>
      {!invalid && (
        <Tab
          tabs={
            isAssetDelisted
              ? [MintType.WITHDRAW, MintType.CLOSE]
              : [MintType.DEPOSIT, MintType.WITHDRAW, MintType.CLOSE]
          }
          current={type}
        >
          <MintForm position={parsed} type={type} key={type} />
        </Tab>
      )}
    </Page>
  )
}

export default Mint

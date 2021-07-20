import { useLocation } from "react-router-dom"
import Tooltips from "../../lang/Tooltips"
import useHash from "../../libs/useHash"
import { useProtocol } from "../../data/contract/protocol"
import Page from "../../components/Page"
import Tab from "../../components/Tab"
import { FarmType, MintType, PoolType } from "../../types/Types"
import PoolForm from "../../forms/PoolForm"
import MintForm from "../../forms/MintForm"
import FarmList from "./FarmList"

const Farm = () => {
  const { state } = useLocation<{ token: string }>()
  const { hash } = useHash<FarmType>()
  const { getSymbol } = useProtocol()

  const render = {
    [FarmType.LONG]: () => <PoolForm type={PoolType.PROVIDE} />,
    [FarmType.SHORT]: () => <MintForm type={MintType.SHORT} />,
  }[hash]

  return (
    <Page title="Farm">
      {!hash ? (
        <FarmList />
      ) : getSymbol(state?.token) === "MIR" ? (
        render()
      ) : (
        <Tab
          tabs={[FarmType.LONG, FarmType.SHORT]}
          tooltips={[Tooltips.Farm.Long, Tooltips.Farm.Short]}
          current={hash}
        >
          {render()}
        </Tab>
      )}
    </Page>
  )
}

export default Farm

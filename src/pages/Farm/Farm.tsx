import Tooltips from "../../lang/Tooltips"
import useHash from "../../libs/useHash"
import Page from "../../components/Page"
import Tab from "../../components/Tab"
import { FarmType, MintType, PoolType } from "../../types/Types"
import PoolForm from "../../forms/PoolForm"
import MintForm from "../../forms/MintForm"
import FarmList from "./FarmList"

const Farm = () => {
  const { hash } = useHash<FarmType>()

  const render = {
    [FarmType.LONG]: () => <PoolForm type={PoolType.PROVIDE} />,
    [FarmType.SHORT]: () => <MintForm type={MintType.SHORT} />,
  }

  return (
    <Page title="Farm">
      {!hash ? (
        <FarmList />
      ) : (
        <Tab
          tabs={[FarmType.LONG, FarmType.SHORT]}
          tooltips={[Tooltips.Farm.Long, Tooltips.Farm.Short]}
          current={hash}
        >
          {render[hash]()}
        </Tab>
      )}
    </Page>
  )
}

export default Farm

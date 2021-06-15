import { format as formatDate } from "date-fns"

import { FMT } from "../../constants"
import { gt } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { useMyLockedUST } from "../../data/my/locked"

import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption, { CaptionAction } from "../../components/Caption"
import Delisted from "../../components/Delisted"
import Formatted from "../../components/Formatted"
import CaptionData from "./CaptionData"

const LockedUST = () => {
  const { totalLockedUST, totalUnlockedUST, dataSource } = useMyLockedUST()

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <>
      <CaptionData
        list={[
          {
            title: "Total Locked UST",
            content: formatAsset(totalLockedUST, "uusd"),
          },
          {
            title: "Total Unlocked UST",
            content: formatAsset(totalUnlockedUST, "uusd"),
          },
          {
            title: "",
            content: (
              <CaptionAction to={getPath(MenuKey.CLAIMUST)}>
                Claim UST
              </CaptionAction>
            ),
          },
        ]}
      />
    </>
  )

  return !dataExists ? null : (
    <Table
      caption={<Caption title="Locked UST" description={description} />}
      columns={[
        {
          key: "symbol",
          title: ["Ticker", "ID"],
          render: (symbol, { idx, status }) => [
            <>
              {status === "DELISTED" && <Delisted />}
              {symbol}
            </>,
            idx,
          ],
          bold: true,
        },
        {
          key: "locked",
          title: ["Locked UST", "Unlock Time"],
          render: (amount, { unlock_time }) => {
            const formatted = <Formatted symbol="uusd">{amount}</Formatted>
            return gt(amount, 0)
              ? [formatted, formatDate(new Date(unlock_time * 1000), FMT.HHmm)]
              : formatted
          },
          align: "right",
        },
        {
          key: "unlocked",
          title: "Unlocked UST",
          render: (amount) => <Formatted symbol="uusd">{amount}</Formatted>,
          align: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default LockedUST

import Tooltips from "../../lang/Tooltips"
import { minus, max, number } from "../../libs/math"
import { PriceKey } from "../../hooks/contractKeys"
import { useProtocol } from "../../data/contract/protocol"
import { useTerraAssetList } from "../../data/stats/list"
import Table from "../../components/Table"
import Percent from "../../components/Percent"
import AssetItem from "../../components/AssetItem"
import Icon from "../../components/Icon"
import Formatted from "../../components/Formatted"
import { TooltipIcon } from "../../components/Tooltip"
import AssetsIdleTable from "../../containers/AssetsIdleTable"
import useListFilter, { Sorter } from "../../components/useListFilter"
import { FarmType } from "../../types/Types"
import styles from "./FarmList.module.scss"

const Sorters: Dictionary<Sorter> = {
  APR: {
    label: "APR",
    compare: ({ apr: a }, { apr: b }) =>
      number(
        minus(
          max([b.long ?? 0, b.short ?? 0]),
          max([a.long ?? 0, a.short ?? 0])
        )
      ),
  },
  LONGAPR: {
    label: "Long APR",
    compare: ({ apr: a }, { apr: b }) => number(minus(b.long, a.long)),
  },
  SHORTAPR: {
    label: "Short APR",
    compare: ({ apr: a }, { apr: b }) => number(minus(b.short, a.short)),
  },
}

const FarmList = () => {
  const { getSymbol } = useProtocol()
  const list = useTerraAssetList()
  const { filter, compare, renderSearch } = useListFilter("APR", Sorters)

  const dataSource = list
    .filter(({ symbol, name }) => [symbol, name].some(filter))
    .sort(compare)
    .sort((a, b) => Number(b.symbol === "MIR") - Number(a.symbol === "MIR"))

  return (
    <>
      {renderSearch()}
      {!list.length ? (
        <AssetsIdleTable />
      ) : (
        <Table
          rowKey="token"
          rows={({ token }) =>
            getSymbol(token) === "MIR" ? { background: "darker" } : {}
          }
          columns={[
            {
              key: "token",
              title: "Ticker",
              render: (token) => <AssetItem token={token} />,
              width: "25%",
              bold: true,
            },
            {
              key: "apr.long",
              title: (
                <TooltipIcon content={Tooltips.Farm.LongAPR}>Long</TooltipIcon>
              ),
              render: (value, { recommended }) => (
                <>
                  <Percent
                    color={recommended === "long" ? "blue" : undefined}
                    dp={1}
                  >
                    {value}
                  </Percent>
                  <p className={styles.link}>
                    Long <span className="desktop">Farm</span>
                    <Icon
                      name="ChevronRight"
                      size={8}
                      className={styles.chevron}
                    />
                  </p>
                </>
              ),
              cell: (_, { token, recommended }) => ({
                background: recommended === "long" ? "darker" : undefined,
                to: { hash: FarmType.LONG, state: { token } },
              }),
              align: "left",
            },
            {
              key: "apr.short",
              title: (
                <TooltipIcon content={Tooltips.Farm.ShortAPR}>
                  Short
                </TooltipIcon>
              ),
              render: (value, { token, recommended }) =>
                getSymbol(token) !== "MIR" && (
                  <>
                    <Percent
                      color={recommended === "short" ? "red" : undefined}
                      dp={1}
                    >
                      {value}
                    </Percent>
                    <p className={styles.link}>
                      Short <span className="desktop">Farm</span>
                      <Icon
                        name="ChevronRight"
                        size={8}
                        className={styles.chevron}
                      />
                    </p>
                  </>
                ),
              cell: (_, { token, recommended }) =>
                getSymbol(token) !== "MIR"
                  ? {
                      background:
                        recommended === "short" ? "darker" : undefined,
                      to: { hash: FarmType.SHORT, state: { token } },
                    }
                  : {},
              align: "left",
            },
            {
              key: PriceKey.PAIR,
              title: "Terraswap Price",
              render: (value) => <Formatted unit="UST">{value}</Formatted>,
              align: "right",
              desktop: true,
            },
            {
              key: "premium",
              title: (
                <TooltipIcon content={Tooltips.Farm.Premium}>
                  Premium
                </TooltipIcon>
              ),
              render: (value) => <Percent>{value}</Percent>,
              align: "right",
              desktop: true,
            },
          ]}
          dataSource={dataSource}
        />
      )}
    </>
  )
}

export default FarmList

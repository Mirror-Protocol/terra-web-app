import Tooltips from "../../lang/Tooltips"
import getLpName from "../../libs/getLpName"
import { useProtocol } from "../../data/contract/protocol"
import { useMyPool } from "../../data/my/pool"
import { getPath, MenuKey } from "../../routes"

import Table from "../../components/Table"
import Caption from "../../components/Caption"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import { StakeType } from "../../types/Types"
import CaptionData from "./CaptionData"

const Pool = () => {
  const { dataSource } = useMyPool()
  const { getSymbol } = useProtocol()

  const dataExists = !!dataSource.length
  const description = dataExists && <CaptionData list={[]} />

  return !dataExists ? null : (
    <Table
      caption={
        <Caption
          title={<TooltipIcon content={Tooltips.My.Pool}>Pool</TooltipIcon>}
          description={description}
        />
      }
      rowKey="token"
      columns={[
        {
          key: "symbol",
          title: "Pool Name",
          render: (symbol, { delisted }) => (
            <>
              {delisted && <Delisted />}
              {getLpName(symbol)}
            </>
          ),
          bold: true,
        },
        {
          key: "balance",
          title: "Balance",
          render: (value, { symbol }) => (
            <Formatted symbol={getLpName(symbol)}>{value}</Formatted>
          ),
          align: "right",
        },
        {
          key: "withdrawable",
          title: (
            <TooltipIcon content={Tooltips.My.Withdrawable}>
              Withdrawable
            </TooltipIcon>
          ),
          render: (withdrawable) =>
            withdrawable && [
              <>
                <Formatted symbol={getSymbol(withdrawable.asset.token)}>
                  {withdrawable.asset.amount}
                </Formatted>{" "}
                +{" "}
                <Formatted symbol="uusd">{withdrawable.uusd.amount}</Formatted>
              </>,
              <Formatted symbol="uusd">{withdrawable.value}</Formatted>,
            ],
          align: "right",
        },
        {
          key: "actions",
          dataIndex: "token",
          render: (token) => (
            <LinkButton
              to={{
                pathname: getPath(MenuKey.STAKE),
                hash: StakeType.STAKE,
                state: { token },
              }}
              size="xs"
              outline
            >
              {MenuKey.STAKE}
            </LinkButton>
          ),
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default Pool

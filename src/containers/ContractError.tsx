import useURL from "../graphql/useURL"
import { useContractsAddress, useAddress } from "../hooks"
import ExtLink from "../components/ExtLink"
import styles from "./ContractError.module.scss"

const ContractError = ({ children: message = "" }: { children?: string }) => {
  const list = useParseContractError(message)

  return !list?.length ? null : (
    <div className={styles.component}>
      <table className={styles.table}>
        <tbody>
          {list.map(({ title, content }) => (
            <tr key={title}>
              <th>{title}</th>
              <td>{content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ContractError

/* hook */
export const useParseContractError = (message: string) => {
  const { contracts, getSymbol } = useContractsAddress()
  const address = useAddress()
  const getURL = useURL()

  try {
    const [, path1] = message.split("wasm/contracts/")
    const [contractAddress, path2] = path1.split("/store?query_msg=")
    const [query_msg, error] = path2.split(": ")
    const url = getURL(contractAddress, query_msg)
    const link = <ExtLink href={url}>{decodeURIComponent(url)}</ExtLink>

    /* contract address */
    const contractSymbol =
      Object.entries(contracts).find(
        ([, value]) => value === contractAddress
      )?.[0] ?? getSymbol(contractAddress)

    const suffixContract = contractSymbol ? ` (${contractSymbol})` : ""

    /* query message */
    const decodedQueryMsg = decodeURIComponent(query_msg)
    const addresses = decodedQueryMsg.match(/terra1[a-z0-9]{38}/g)

    const nameAddress = (addr: string) =>
      getSymbol(addr) || (addr === address && "User address")

    const parsedAddresses =
      addresses && addresses.map(nameAddress).filter(Boolean).join()

    const suffixQuery = parsedAddresses && ` (${parsedAddresses})`

    return [
      { title: "Contract address", content: contractAddress + suffixContract },
      { title: "Query message", content: decodedQueryMsg + suffixQuery },
      { title: "Error message", content: error },
      { title: "LCD", content: link },
    ]
  } catch (error) {
    return undefined
  }
}

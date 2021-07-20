type GetDocument = (item: ListedItem) => ContractVariables | undefined
interface ContractVariables {
  contract: string
  msg: object
}

type ContractData = { Height: string; Result: string }
interface WasmResponse {
  WasmContractsContractAddressStore: ContractData | null
}

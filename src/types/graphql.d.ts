interface ContractVariables {
  contract: string
  msg: object
}

type ContractData = { Height: string; Result?: string } | null
interface ContractsData {
  WasmContractsContractAddressStore: ContractData
}

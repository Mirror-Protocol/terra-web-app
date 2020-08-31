import { head } from "ramda"
import { ApolloError } from "@apollo/client"
import ContractError, { useParseContractError } from "./ContractError"

interface Props {
  children: ApolloError | Error
}

const ErrorComponent = ({ children: error }: Props) => {
  const parseError = (error: ApolloError | Error) =>
    "graphQLErrors" in error ? head(error.graphQLErrors) : error

  const message = parseError(error)?.message ?? "Error"
  const isContractError = useParseContractError(message)

  return !isContractError ? (
    <div className="red">{message}</div>
  ) : (
    <ContractError>{message}</ContractError>
  )
}

export default ErrorComponent

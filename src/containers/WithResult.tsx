import { ReactNode } from "react"
import classNames from "classnames"
import { useCombineKeys, useCombineResult, useRefetch } from "../hooks"
import { DataKey } from "../hooks/useContract"
import Loading from "../components/Loading"
import ErrorComponent from "./ErrorComponent"

interface Props {
  /** ref:useContract.ts */
  keys?: DataKey[]
  /** Replace keys */
  results?: Result[]
  /** Force to render data only */
  dataOnly?: boolean
  /** Show indicator during loading even if data exists */
  loadingFirst?: boolean
  /** Size of CircularProgress */
  size?: number
  /** Prevent blinking during loading */
  noBlink?: boolean
  /** Replace Loading */
  renderLoading?: () => ReactNode
  /** Replace ErrorComponent */
  renderError?: () => ReactNode
  children: ReactNode | ((result: Result) => ReactNode)
}

const WithResult = ({ keys = [], results = [], children, ...props }: Props) => {
  const { size, noBlink, loadingFirst, dataOnly } = props

  useRefetch(keys)
  const combinedKey = useCombineKeys(keys)
  const combinedResult = useCombineResult(results)
  const { data, loading, error } = keys.length ? combinedKey : combinedResult

  const renderLoading = () =>
    props.renderLoading ? <>{props.renderLoading()}</> : <Loading size={size} />

  const renderError = (error: Error) =>
    props.renderError ? (
      <>{props.renderError()}</>
    ) : (
      <ErrorComponent>{error}</ErrorComponent>
    )

  const render = () => {
    const className = classNames({ loading })
    return noBlink ? (
      <>{children}</>
    ) : (
      <div className={className}>{children}</div>
    )
  }

  return dataOnly || (data && !(loading && loadingFirst))
    ? render()
    : loading
    ? renderLoading()
    : error
    ? renderError(error)
    : null
}

export default WithResult

import React, { ReactNode } from "react"
import classNames from "classnames"
import { useCombineResult, useRefetch } from "../hooks"
import { DataKey } from "../hooks/useContract"
import ErrorComponent from "./ErrorComponent"
import Loading from "./Loading"

interface Props {
  /** ref:useContract.ts */
  keys?: DataKey[]
  /** Replace keys */
  result?: Result
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

const WithResult = ({ keys = [], size, children, ...props }: Props) => {
  const { noBlink, loadingFirst, dataOnly } = props

  useRefetch(keys)
  const result = useCombineResult(keys)
  const { data, loading, error } = props.result ?? result

  const renderLoading = () =>
    props.renderLoading ? props.renderLoading() : <Loading size={size} />

  const renderError = (error: Error) =>
    props.renderError ? (
      props.renderError()
    ) : (
      <ErrorComponent>{error}</ErrorComponent>
    )

  const render = () => {
    const className = classNames({ loading })
    const content = typeof children === "function" ? children(result) : children
    return noBlink ? content : <div className={className}>{content}</div>
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

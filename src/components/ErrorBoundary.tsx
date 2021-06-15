import { Component, ReactNode, ErrorInfo } from "react"

interface Props {
  handleError?: (error: Error, errorInfo: ErrorInfo) => void
  fallback?: (error?: Error) => ReactNode
}

interface State {
  error?: Error
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state = { error: undefined, hasError: false }
  static getDerivedStateFromError = () => ({ hasError: true })

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error })
    this.props.handleError?.(error, errorInfo)
  }

  render() {
    const { fallback, children } = this.props
    const { error } = this.state
    return error ? fallback?.(error) ?? null : children
  }
}

export default ErrorBoundary

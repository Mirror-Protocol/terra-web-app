import { FC, Suspense } from "react"
import ErrorBoundary from "./ErrorBoundary"
import Card from "./Card"

const Boundary: FC = ({ children }) => {
  const renderError = (error?: Error) => (
    <Card title="Error">{error?.message}</Card>
  )

  return (
    <ErrorBoundary fallback={renderError}>
      <Suspense fallback>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default Boundary

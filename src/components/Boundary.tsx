import { FC, ReactNode, Suspense } from "react"
import ErrorBoundary from "./ErrorBoundary"
import Card from "./Card"

const Boundary: FC<{ fallback?: ReactNode }> = ({ children, fallback }) => {
  const renderError = (error?: Error) => (
    <Card title="Error">{error?.message}</Card>
  )

  return (
    <ErrorBoundary fallback={renderError}>
      <Suspense fallback={fallback ?? null}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default Boundary

/* utils */
export const bound = (children: ReactNode, fallback?: ReactNode) => (
  <Boundary fallback={fallback}>{children}</Boundary>
)

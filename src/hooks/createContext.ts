import { createContext, useContext } from "react"

export default <A>(name: string) => {
  const ctx = createContext<A | undefined>(undefined)

  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) throw new Error(`${name} must be inside a Provider with a value`)
    return c
  }

  return [useCtx, ctx.Provider] as const
}

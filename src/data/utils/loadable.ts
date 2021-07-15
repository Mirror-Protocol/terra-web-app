import { useEffect } from "react"
import { Loadable, RecoilState, RecoilValue } from "recoil"
import { useRecoilState, useRecoilValueLoadable } from "recoil"

export const useStore = <T>(
  recoilValue: RecoilValue<T>,
  recoilState: RecoilState<T>
) => {
  const [state, setState] = useRecoilState(recoilState)
  const query = useRecoilValueLoadable(recoilValue)

  useEffect(() => {
    query.state === "hasValue" && setState(query.contents)
  }, [query, setState])

  return { contents: state, isLoading: query.state === "loading" }
}

export const useStoreLoadable = <T>(
  recoilValue: RecoilValue<T>,
  recoilState: RecoilState<T>
) => {
  const [state, setState] = useRecoilState(recoilState)
  const query = useRecoilValueLoadable(recoilValue)

  useEffect(() => {
    query.state === "hasValue" && setState(query.contents)
  }, [query, setState])

  return state
}

export const getLoadableContents = <T>(query: Loadable<T>) =>
  query.state === "hasValue" ? query.contents : undefined

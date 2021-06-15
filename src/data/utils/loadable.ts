import { useEffect } from "react"
import { RecoilState, RecoilValue } from "recoil"
import { useRecoilState, useRecoilValueLoadable } from "recoil"

export const useStoreLoadable = <T>(
  recoilState: RecoilState<T>,
  recoilValue: RecoilValue<T>
) => {
  const [state, setState] = useRecoilState(recoilState)
  const query = useRecoilValueLoadable(recoilValue)

  useEffect(() => {
    query.state === "hasValue" && setState(query.contents)
  }, [query, setState])

  return state
}
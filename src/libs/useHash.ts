import { useEffect } from "react"
import { useLocation, useHistory } from "react-router-dom"

const useHash = <T extends string>(initial?: T) => {
  const location = useLocation()
  const hash = decode(location.hash) as T
  const history = useHistory()
  const { replace } = history

  /* redirect */
  useEffect(() => {
    !hash && initial && replace(encode(initial))
  }, [hash, replace, initial])

  return { hash }
}

export default useHash

/* helpers */
const encode = (hash: string) => "#" + encodeURIComponent(hash)
const decode = (hash: string) =>
  decodeURIComponent(hash.replace("#", "")) || undefined

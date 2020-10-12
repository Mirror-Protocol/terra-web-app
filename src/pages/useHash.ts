import { useEffect } from "react"
import { useLocation, useHistory } from "react-router-dom"

export default <T extends string>(initial?: T) => {
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

/* helpers */
const encode = (hash: string) => "#" + encodeURIComponent(hash)
const decode = (hash: string) =>
  decodeURIComponent(hash.replace("#", "")) || undefined

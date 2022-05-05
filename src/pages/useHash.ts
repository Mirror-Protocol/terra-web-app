import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default <T extends string>(initial?: T) => {
  const location = useLocation()
  const hash = decode(location.hash) as T
  const navigate = useNavigate()

  /* redirect */
  useEffect(() => {
    !hash && initial && navigate(encode(initial), { replace: true })
  }, [hash, navigate, initial])

  return { hash }
}

/* helpers */
const encode = (hash: string) => "#" + encodeURIComponent(hash)
const decode = (hash: string) => {
  const index = hash.indexOf("?")
  if (index > 0) {
    hash = hash.substr(0, index)
  }
  return decodeURIComponent(hash.replace("#", "")) || undefined
}

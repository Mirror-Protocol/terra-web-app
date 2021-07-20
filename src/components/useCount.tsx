import { useRef, useState, useEffect } from "react"
import { plus, minus, div, gt, lt } from "../libs/math"

const FPS = 15
const INTERVAL = 1000 / FPS
const DURATION = 300

export const useCount = (target: string) => {
  const prevRef = useRef<string>(target)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const [count, setCount] = useState(false)
  const [current, setCurrent] = useState<string>(target)

  useEffect(() => {
    setCount(true)
  }, [target])

  useEffect(() => {
    const change = () => {
      const timeoutID = setTimeout(() => {
        const delta = minus(target, prevRef.current)
        const next = plus(current, div(delta, div(DURATION, INTERVAL)))

        if (gt(delta, 0) ? lt(next, target) : gt(next, target)) {
          setCurrent(next)
        } else {
          setCount(false)
          setCurrent(target)
          prevRef.current = target
        }
      }, INTERVAL)

      timeoutRef.current = timeoutID
    }

    count && change()
    return () => clearTimeout(timeoutRef.current!)
  }, [count, current, target])

  return current
}

export default useCount

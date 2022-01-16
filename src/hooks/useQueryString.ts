import React, { useCallback, useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import qs from "querystring"

const useQueryString = <T extends string>(key: string, initialValue?: T) => {
  const history = useHistory()
  const location = useLocation()

  const setStateValueCallback = useCallback(
    (current: T | undefined) => {
      const parsed = qs.parse(location.search?.replace("?", ""))
      console.log("parsed")
      console.log(parsed)
      if (!current && !parsed?.[key]) {
        console.log("return initialValue", initialValue)
        return initialValue
      }
      if (current !== (parsed?.[key] as T)) {
        console.log("return parsed?.[key] as T", parsed?.[key])
        return parsed?.[key] as T
      }
      console.log("return current", current)
      return current
    },
    [initialValue, key, location]
  )

  const [stateValue, setStateValue] = useState<T | undefined>(() =>
    setStateValueCallback(undefined)
  )

  const setQueryString = useCallback(
    (value: T | undefined) => {
      console.log("setQueryString called", key, value)
      // if (typeof stateValue === "undefined") {
      //   return;
      // }
      const parsed: qs.ParsedUrlQuery = qs.parse(
        location.search?.replace("?", "")
      )
      if (parsed?.[key] === value) {
        return
      }
      parsed[key] = value as unknown as string
      history.replace({
        ...location,
        search: qs.stringify(parsed),
      })
    },
    [history, key, location]
  )

  // useEffect(() => {
  //   setQueryString(stateValue);
  // }, [setQueryString, stateValue]);

  useEffect(() => {
    console.log(key, stateValue)
  }, [key, stateValue])

  useEffect(() => {
    setStateValue(setStateValueCallback)
  }, [setStateValueCallback])

  return [stateValue, setQueryString] as [
    value: T | undefined,
    setValue: React.Dispatch<React.SetStateAction<T | undefined>>
  ]
}
export default useQueryString

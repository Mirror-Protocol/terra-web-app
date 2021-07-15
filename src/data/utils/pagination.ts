import { useEffect, useState } from "react"
import { RecoilValueReadOnly, useRecoilValueLoadable } from "recoil"
import { last } from "ramda"

export const iterateAllPage = async <T, Offset>(
  query: (offset?: Offset) => Promise<T[]>,
  nextOffset: (item?: T) => Offset | undefined,
  limit: number
) => {
  const iterate = async (acc: T[], offset?: Offset): Promise<T[]> => {
    const data = await query(offset)
    const done = data.length < limit
    const next = [...acc, ...data]

    return done ? next : await iterate(next, nextOffset(last(data)))
  }

  return await iterate([])
}

export const usePagination = <T, Offset = number>(
  query: (offset?: Offset) => RecoilValueReadOnly<T[] | undefined>,
  next: (params: { offset?: Offset; data: T[] }) => Offset | undefined,
  limit: number,
  key: keyof T
) => {
  const [offset, setOffset] = useState<Offset>()
  const [idle, setIdle] = useState(true)
  const [done, setDone] = useState(false)
  const [data, setData] = useState<T[]>([])
  const { state, contents } = useRecoilValueLoadable(query(offset))

  useEffect(() => {
    if (state === "hasValue" && contents) {
      setIdle(false)
      setData((prev) => uniqByKey([...prev, ...contents], key))
      setDone(contents.length < limit)
    }
  }, [state, contents, limit, key])

  useEffect(() => {
    return () => {
      setOffset(undefined)
      setDone(false)
      setData([])
    }
  }, [])

  return {
    idle,
    isLoading: state === "loading",
    data,
    more: !done
      ? () => setOffset((offset) => next({ offset, data }))
      : undefined,
  }
}

/* utils */
export const uniqByKey = <T>(list: T[], key: keyof T) =>
  list.reduce<T[]>((acc, item) => {
    const exists = acc.some((prev) => prev[key] === item[key])
    return exists ? acc : [...acc, item]
  }, [])

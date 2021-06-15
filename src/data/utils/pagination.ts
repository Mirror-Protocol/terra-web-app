import { useEffect, useState } from "react"
import { RecoilValueReadOnly, selector, useRecoilValueLoadable } from "recoil"
import { last } from "ramda"

export const iterateAllPageQuery = selector({
  key: "iterateAllPage",
  get: () => {
    return async <T, Offset>(
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
  },
})

export const usePagination = <T, Offset = number>(
  query: (offset?: Offset) => RecoilValueReadOnly<T[] | undefined>,
  next: (params: { offset?: Offset; data: T[] }) => Offset | undefined,
  limit: number
) => {
  const [offset, setOffset] = useState<Offset>()
  const [done, setDone] = useState(false)
  const [data, setData] = useState<T[]>([])
  const { state, contents } = useRecoilValueLoadable(query(offset))

  useEffect(() => {
    if (state === "hasValue" && contents) {
      setData((prev) => [...prev, ...contents])
      setDone(contents.length < limit)
    }
  }, [state, contents, limit])

  useEffect(() => {
    return () => {
      setOffset(undefined)
      setDone(false)
      setData([])
    }
  }, [])

  return {
    loading: state === "loading",
    data,
    more: !done
      ? () => setOffset((offset) => next({ offset, data }))
      : undefined,
  }
}

import { SwapAttribute } from "types/swapTx"

export default (parserKey: string, results: SwapAttribute[]) => {
  let res = []

  let index = -1
  for (let i = 0; i < results.length; i++) {
    const data = [{ title: results[i].key, content: results[i].value }]
    if (results[i].key.startsWith("*")) {
      data[0].title = data[0].title.replace("* ", "")
      res[index].push(...data)
    } else {
      index++
      res.push(data)
    }
  }

  // FIXME: we use specified format
  return res
}

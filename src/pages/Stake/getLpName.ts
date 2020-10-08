import { LP, UST } from "../../constants"

export default (symbol: string) => `${[symbol, UST].join("-")} ${LP}`

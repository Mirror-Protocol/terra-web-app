import { useQuery } from "react-query"
import axios from "axios"

const config = { baseURL: "https://assets.terra.money" }

const useTerraAssets = (path: string) =>
  useQuery(path, async () => {
    const { data } = await axios.get(path, config)
    return data
  })

export default useTerraAssets

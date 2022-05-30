import Axios from "axios"
import { setupCache } from "axios-cache-adapter"

const cache = setupCache({
  maxAge: 2500,
  exclude: {
    query: false,
    methods: ["post", "patch", "put", "delete"],
  },
})

const axios = Axios.create({
  adapter: cache.adapter,
})

export default axios

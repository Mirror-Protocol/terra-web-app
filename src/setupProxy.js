const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
  app.use(
    createProxyMiddleware(process.env.REACT_APP_MAINNET_SERVICE_V1_URL, {
      target: process.env.REACT_APP_MAINNET_SERVICE_V1_PROXY_URL,
      changeOrigin: true,
      logLevel: "debug",
      pathRewrite: (path) => {
        return path.replace(process.env.REACT_APP_MAINNET_SERVICE_V1_URL, "")
      },
    })
  )

  app.use(
    createProxyMiddleware(process.env.REACT_APP_MAINNET_SERVICE_URL, {
      target: process.env.REACT_APP_MAINNET_SERVICE_PROXY_URL,
      changeOrigin: true,
      pathRewrite: (path) => {
        return path.replace(process.env.REACT_APP_MAINNET_SERVICE_URL, "")
      },
    })
  )

  app.use(
    createProxyMiddleware(process.env.REACT_APP_MAINNET_DASHBOARD_URL, {
      target: process.env.REACT_APP_MAINNET_DASHBOARD_PROXY_URL,
      changeOrigin: true,
      pathRewrite: (path) => {
        return path.replace(process.env.REACT_APP_MAINNET_DASHBOARD_URL, "")
      },
    })
  )
}

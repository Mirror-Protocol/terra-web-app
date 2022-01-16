/* config-overrides.js */
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config, env) {
  // let loaders = config.resolve;
  // loaders.fallback = {
  //   stream: require.resolve("stream-browserify"),
  //   buffer: require.resolve("buffer"),
  // };

  config.plugins.push(
    new NodePolyfillPlugin({
      excludeAliases: [
        "assert",
        "buffer",
        "console",
        "constants",
        "crypto",
        "domain",
        "events",
        "http",
        "https",
        "os",
        "path",
        "punycode",
        "querystring",
        "_stream_duplex",
        "_stream_passthrough",
        "_stream_transform",
        "_stream_writable",
        "string_decoder",
        "sys",
        "timers",
        "tty",
        "url",
        "util",
        "vm",
        "zlib",
      ],
    })
  );
  return config;
};

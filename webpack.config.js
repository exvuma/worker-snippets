module.exports = {
  entry: './snippets/_index.js',
  mode: 'development',
  output: {
    pathinfo: false,
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: false,
    removeEmptyChunks: false,
    removeAvailableModules: false,
    mergeDuplicateChunks: false,
  },
}

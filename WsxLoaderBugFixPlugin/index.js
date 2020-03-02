// 修复 "@tinajs/wxs-loader": "1.2.7" 打包后 wxs 路径中出现 node_modules 的 BUG
module.exports = class PageBackupPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('WsxLoaderBugFixPlugin', (compilation) => {
      const { assets } = compilation
      Object.entries(assets).forEach(([filePath, fileContent]) => {
        if (filePath.startsWith('wxs/_/_/node_modules/')) {
          // 小程序不允许路径中出现 'node_modules'，需要进行字符替换
          const newFilePath = filePath.replace('wxs/_/_/node_modules/', 'wxs/_/_/_node_modules_/')
          assets[newFilePath] = fileContent
          delete assets[filePath]
        }
      })
    })
  }
}

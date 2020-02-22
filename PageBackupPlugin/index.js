const ConcatSource = require('webpack-sources').ConcatSource
const { readFile } = require('fs').promises
const UglifyJS = require('uglify-es')

const readFiles = (paths) => {
  return Promise.all(paths.map(async(path) => {
    const content = await readFile(require.resolve(path), 'utf-8')

    return UglifyJS.minify(content).code
  }))
}

module.exports = class PageBackupPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapPromise('PageBackupPlugin', async(compilation) => {
      const { assets } = compilation

      if (!assets['./app.json']) { // 热更新时 app.json 有可能没变动
        return
      }

      const [
        template,
        utilContent,
      ] = await readFiles([
        './template.js',
        './backup-page-util.js',
      ])

      assets['./backup-page-util.js'] = new ConcatSource(utilContent)

      const config = JSON.parse(assets['./app.json'].source())
      config.subPackages.forEach((subpackage) => {
        subpackage.pages.forEach((pagePath) => {
          config.pages.push(`pages/${pagePath}`)

          // 添加备份页面入口
          assets[`pages/${pagePath}.js`] = new ConcatSource(template.replace('routePath', `'/${subpackage.root + pagePath}'`))
          assets[`pages/${pagePath}.wxml`] = new ConcatSource('<view></view>')
        })
      })

      // 重写 app.json
      assets['./app.json'] = new ConcatSource(JSON.stringify(config))
    })
  }
}

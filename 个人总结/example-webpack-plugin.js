const RequestShortener = require('webpack/lib/RequestShortener')
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers')
const requestShortener = require('webpack/lib/RequestShortener')
const RawSource = require("webpack-core/lib/RawSource");
const esprima = require('esprima')
const escodegen = require('escodegen')
const estraverse = require('estraverse')
function spliceString(str, begin, end, replacement) {
    return str.substr(0, begin) + replacement + str.substr(end);
}
function example (options){
  this.options = Object.assign({
    noConsole: true
  },options)
}

module.exports = example

example.prototype.apply = function (compiler) {
  let options = this.options;
  options.test = options.test || /\.js($|\?)/i

  let requestShortener = new RequestShortener(compiler.context)
  compiler.plugin('compilation', (compilation) => {
    if(options.sourceMap !== false){
      compilation.plugin('build-module', (module) =>{
        module.useSourceMap = true
      })
    }

    compilation.plugin('optimize-chunk-assets', (chunks, callback) =>{
      let files = []
      chunks.forEach((chunk) => {
        chunk.files.forEach((file) => {
          files.push(file)
        })
      })
      compilation.additionalChunkAssets.forEach( file => files.push(file))
      files = files.filter(ModuleFilenameHelpers.matchObject.bind(undefined, options))
      files.forEach(( file ) => {
        let asset = compilation.assets[file]
        const input = asset.source()
        try{
          let ast = esprima.parse(input, {range:true, tokens: true})
          ast = estraverse.replace(ast,{
              enter:function(node,parent) {
                  if('ExpressionStatement' === node.type && node.expression.type === 'CallExpression'){
                      let object = node.expression.callee.object
                      if(typeof object !== 'undefined' && object.name === 'console' && object.type === 'Identifier'){
                          if(parent.body && Array.isArray(parent.body))
                            this.remove()
                      }
                  }
              }
          })
          let result = escodegen.generate(ast)
          compilation.assets[file] = new RawSource(result)
        }catch(e){
          if(e.lineNumber){
            let original = sourceMap && sourceMap.originalPositionFor({
              line: e.lineNumber,
              column: e.column
            })
            if(original && original.source) {
              compilation.errors.push(new Error(file + " from esprima\n" + err.message + " [" + requestShortener.shorten(original.source) + ":" + original.line + "," + original.column + "]"));
            } else {
              compilation.errors.push(new Error(file + " from esprima\n" + err.message + " [" + file + ":" + e.lineNumber + "," + e.column + "]"));
            }
          }else if(e.description) {
  						compilation.errors.push(new Error(file + " from esprima\n" + e.description));
          }else {
              compilation.errors.push(new Error(file + " from esprima\n" + e.stack));
          }
        }
      })
      callback()
    })
  })
}

module.exports = example

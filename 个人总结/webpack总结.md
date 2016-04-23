## webpack的两大思想
1. 所有的都是模块
2. 按需加载

## webpack的简单配置   

```JavaScript
let entry =getEntry(); //函数返回一个数组,是你所有的入口文件
let configure = {
    entry : entry,
    output : {      //文件输出路径 chunkhash为模块名称的hash,hash为代码文件的hash
        path : path.resolve('./'),   //字符串类型的值，指定webpack的输出文件路径——要求是个绝对路径
        filename : debug ? '[name].js' : '[chunkhash:8].[name].min.js',   //根据是否问生产环境,设置入口文件的文件名 [name]为入口文件名
        chunkFilename : debug ? 'chunk.js' : '[chunkhash:8].chunk.min.js'  //非程序入口模块集的文件名称,可以设置[id]为模块集的id
        publicPath : publicPath    //当script,link或者img标签引入资源时,自动转换成publicPath
    },
    resolve : {   //将模块替换成别的模块
        extensions: ['', '.coffee', '.js', '.jpg', '.png', '.css', '.scss'], //用来加载模块的后缀名
        alias : {
            base : __dirname + '/src/base', //当require('base')时 ,依次用原先的后缀名,.coffee,.js来加载
        }       
    },
    module : {    //影响模块选项
        loaders:[  //加载器 
            {
                test: /\.jsx?$/,     //找出后缀名为js或者jsx
                exclude: /node_modules/,     //不在node_modlues中寻找文件_
                loader: 'babel?presets[]=react,presets[]=es2015' //加载器 babel 6 后分组件插入,这里我们选择 react处理jsx,然后用es2015转化
            },
            {
                test: /\.css$/, 
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },
    plugins[
        new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {   //将css引出
            // 当allChunks指定为false时，css loader必须指定怎么处理
            // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
            // 第一个参数`notExtractLoader`，一般是使用style-loader
            // @see https://github.com/webpack/extract-text-webpack-plugin
            allChunks: false
        }),
        new HtmlWebpackPlugin({     //根据模板插入css/js等生成最终HTML
            script : config.output.publicPath + 'page/' + filename + '/js/' + filename + '.[chunkhash:8].js',
            css : config.output.publicPath + 'page/' + filename + '/css/' + filename + '.[chunkhash:8].css',
            filename:(debug? '/' : '/tmpl') + '/page/' + filename + '/tmpl/' + filename + '.dwt',    //生成的html存放路径，相对于 path
            inject : 'body',    //允许插件修改哪些内容，包括head与body
            chunks: ['vendors', filename],
            minify:{    //压缩HTML文件
                removeComments:true,    //移除HTML中的注释
                removeCommentsFromCDATA:true,
                collapseWhitespace:false    //删除空白符与换行符
            }
        }),
        new UglifyJsPlugin()  //js检查
    ],
    devServer: {
        hot: true,   //热加载
        noInfo: false,  //输出编译信息
        inline: true,   //页面实时加载功能
        publicPath: publicPath,
        stats: {
            cached: false,
            colors: true
        }
    }
}
```




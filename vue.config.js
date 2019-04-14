var webpack = require("webpack")
module.exports = {
    // baseUrl: './',
    devServer: {
        open: true,
        proxy: {
            '/api': { //匹配所有以‘/api’开头的请求路径
                //target: 'http://Report.ogahome.cn:6777', //代理目标的基础路径
                //target: 'http://61.181.123.70', //代理目标的基础路径
                // target: 'http://192.168.0.227', //代理目标的基础路径
                target: 'http://localhost:3186', //代理目标的基础路径
                changeOrigin: true, //支持跨域
                pathRewrite: { //重写路径：去掉路径中开头的'/api'
                    '^/api': ''
                }
            }
        },
        port: 8888,
        host: '0.0.0.0',
    },
    chainWebpack: config => {
        config
            .entry('./src/main.js')
            .add('babel-polyfill')
            .end()
    },  //根据刚才在思否上查的资料修改的
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         jQuery: "jquery",
    //         $: "jquery"
    //     })
    // ]
}
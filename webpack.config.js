const path = require('path');

module.exports = {
    //入口
    entry: './src/index.js',
    //出口
    output: {
        // publicPath代表虚拟打包路径，不会真正生成文件夹，而是在8080端口虚拟生成
        publicPath: 'xuni',
        //打包出来的文件名,不会物理生成
        filename: 'bundle.js',
    },
    devServer:{
        port: 8080,
        contentBase: 'www'
    }
};
var webpack = require('webpack')
var path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: {
      bundle:'./entry.js',
      //vendor:'./vendor.js'
  },
  output: {
    path: __dirname+'/web',
    publicPath:'/web/',
    filename: '[name].js',
    library:'[name]',
    //chunkFilename:'[id].[hash].chunk.js'
  },
  module: {
    loaders: [
       { 
          test: /\.(woff|svg|eot|ttf)\??.*$/, 
          loader: 'url-loader?limit=50000&name=[path][name].[ext]'
      },
      {test: /\.css$/, loader: 'style!css?postcss!sass'},
      {test:/\.js$/,exclude:/node_modules/,loader:'babel'},
      {test:/\.html$/,loader:"html"},
      {test:/\.vue$/,exclude: /node_modules/,loader:"vue-loader"},
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loaders: [
                    'url-loader',
                     'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?{pngquant:{quality: 65, speed: 4}, mozjpeg: {quality: 65},svgo:{quality:65},gifsicle:{quality:65}}'
                    ]
      },
    ]
  },
  vue: {
    loaders: {
      css: 'style!css!autoprefixer!sass',
    }
  },
  plugin:[
   /* new webpack.ProvidePlugin({
         $: "jquery",
         jQuery: "jquery",
        "window.jQuery":"jquery"
    }),*/
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings:false
      }
    })
  ],
  postcss:[
    require('autoprefixer')
  ],
  devServer: {
    inline: true,
    hot: true,
    port:6060
  },
  babel: {
    presets: ['es2015'],
  },
  externals: {
        'jquery$':'window.$',
        'vue$':'window.Vue',
        'vue-router$':'window.VueRouter',
        'vue-resource$':'window.VueResource',
        'vuex$':'window.Vuex'
  },
  resolve: {
    extensions: ['', '.js','json','.vue'],
    alias: {
            'vue': __dirname + '/node_modules/vue/dist/vue.min.js',
            'vuex': __dirname + '/node_modules/vuex/dist/vuex.min.js',
            'vue-router': __dirname + '/node_modules/vue-router/dist/vue-router.min.js',
            'vue-resource': __dirname + '/node_modules/vue-resource/dist/vue-resource.min.js',
            'jquery$':__dirname +  '/node_modules/jquery/dist/jquery.min.js',
            'resources':resolve('resources'),
            'web':resolve('web'),
            'common':resolve('web/common'),
            'store':resolve('web/store'),
            'modules':resolve('web/modules')
        },
    modules: [
      resolve('node_modules')
    ],
  },
}
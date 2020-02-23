
const CopyWebpackPlugin = require('copy-webpack-plugin');
const manifestPlugin = require('pwa-manifest-webpack-plugin');
const workbox = require('workbox-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  // pwa: {
  //   name: 'Home',
  //   themeColor: '#2196F3',
  //   msTileColor: '#2196F3',
  //   appleMobileWebAppCapable: 'yes',
  //   appleMobileWebAppStatusBarStyle: 'black',
  //   workboxOptions: {
  //     skipWaiting: false,
  //     swSrc: 'service-worker.js'
  //   },
  //   iconPaths: {
  //     favicon32: 'img/icons/favicon-32x32.png',
  //     favicon16: 'img/icons/favicon-16x16.png',
  //     appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
  //     maskIcon: 'img/icons/safari-pinned-tab.svg',
  //     msTileImage: 'img/icons/msapplication-icon-144x144.png'
  //   },
  //   //workboxPluginMode: 'InjectManifest'
  // },
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new manifestPlugin({
        name: "Home",
        short_name: "Home",
        theme_color: "#FFFFFF",
        msTileColor: "#FFFFFF",
        start_url: ".",
        display: "standalone",
        background_color: "#FFFFFF",
        icons: [
          {
            src: "./img/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "./img/icons/android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "./img/icons/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }),
      
      // new workbox.InjectManifest({
      //   swSrc: '@/new-service-worker.js',
      // }),

      new CopyWebpackPlugin([{
        from: "src/new-service-worker.js",
        to: "service-worker.js"
      }]),

      new WebpackManifestPlugin({
        fileName: "precaching-list.js",
        serialize: (manifest) => {
          let precahings = [];
          for (let [key, value] of Object.entries(manifest)){
            precahings.push(value);
          }
          return "__manifestPrecaching = " + JSON.stringify(precahings, null, 2) + ";";
        },
      }),
    ]
  }
};
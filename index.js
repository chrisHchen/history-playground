const express = require("express")
const path = require("path")
const webpack = require("webpack")
const webpackConfig = require("./webpack-dev-conf.js")
const compiler = webpack(webpackConfig)
const router = require('express').Router()

router.get('/test*', function(req, res){
  res.write(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>play ground</title>
    </head>
    <body>
      <div id="app"></div>
      <script src="/build/app.js"></script>
    </body>
    </html>`
  )
  res.end()
})
const devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath || '/build',
  stats: {
    colors: true,
    chunks: false
  }
})
const app = express()
app.use(express.static(path.join(__dirname, './')))
app.use(devMiddleware)
app.use(router)
app.listen(3000, function() {
  console.log('app running at 3000')
})

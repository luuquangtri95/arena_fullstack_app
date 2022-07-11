import 'dotenv/config'

import createError from 'http-errors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import http from 'http'
import cors from 'cors'

import indexRouter from './src/routes/index.js'
import userRouter from './src/routes/user.js'
import countryRouter from './src/routes/country.js'
import productRouter from './src/routes/product.js'
import vendorRouter from './src/routes/vendor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const PORT = process.env.PORT || 5000

// view engine setup
app.set('port', PORT)
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')))

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/api/users', userRouter)
app.use('/api/countries', countryRouter)
app.use('/api/products', productRouter)
app.use('/api/vendors', vendorRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(PORT)
server.on('error', (error) => {
  throw error
})
server.on('listening', () => {
  console.log('App listening on port', PORT)
})

export default app

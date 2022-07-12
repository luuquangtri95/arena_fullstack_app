import 'dotenv/config'

import createError from 'http-errors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import indexRouter from './src/routes/index.js'
import userRouter from './src/routes/user.js'
import countryRouter from './src/routes/country.js'
import productRouter from './src/routes/product.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

const app = express()

// view engine setup
app.set('port', PORT)
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'pug')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  NODE_ENV === 'development'
    ? express.static(path.join(__dirname, 'public'))
    : express.static(path.join(__dirname, '..', 'frontend', 'build')),
)

// app.use('/', indexRouter)
app.use('/api/users', userRouter)
app.use('/api/countries', countryRouter)
app.use('/api/products', productRouter)

app.get('/*', function (req, res) {
  NODE_ENV === 'development'
    ? res.render('index', { title: 'Express' })
    : res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'))
})

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

app.listen(PORT, () => {
  console.log(`[NodeJS] app listening on port ${PORT}`)
})

export default app

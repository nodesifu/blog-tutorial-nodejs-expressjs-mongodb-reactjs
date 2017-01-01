import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session' // https://github.com/expressjs/session
import bodyParser from 'body-parser' // https://github.com/expressjs/body-parser
import morgan from 'morgan' // https://github.com/expressjs/morgan
import bluebird from 'bluebird' // https://github.com/petkaantonov/bluebird

import config from './config'
import authRoute from './routes/auth'
import userRoute from './routes/user'
import pageRoute from './routes/page'
import errorHandler from './middlewares/errorHandler'
import checkToken from './middlewares/checkToken'
import getUser from './middlewares/getUser'

const app = express()

mongoose.Promise = bluebird
mongoose.connect(config.database, err => {
  if (err) throw err
  console.log('Mongo connected')
})

app.listen(config.port, err => {
  if (err) throw err
  console.log(`Server listening on port ${config.port}`)
})

app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ // https://books.google.com.ua/books?id=ywrODAAAQBAJ&pg=PA134&lpg=PA134&dq=saveUninitialized&source=bl&ots=ebWyG5qQRM&sig=x2Tm-CsGUXPkPkr7db9GvO_m03c&hl=ru&sa=X&ved=0ahUKEwjto62i6YzRAhXJXSwKHSijBUsQ6AEIMjAE#v=onepage&q=saveUninitialized&f=false
  resave: true,
  saveUninitialized: true,
  secret: config.secret
}))

app.use('/api', authRoute)
app.use('/api', checkToken, userRoute)
app.use(getUser)
app.use('/api', checkToken, pageRoute)

app.use(errorHandler)

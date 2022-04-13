const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const usePassport = require('./config/passport')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const routes = require('./routes')
const PORT = process.env.PORT || 3000

const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)

app.use(flash())

app.use(bodyParser.urlencoded({ extende: true }))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') 
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use(routes)

require('./config/mongoose')

app.listen(PORT, () => {
  console.log(`The tracker is on the http://localhost:${PORT}`)
})
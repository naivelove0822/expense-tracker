const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const app = express()
const routes = require('./routes')
const port = 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'expenseTracker',
  resave: false,
  saveUninitialized: true
}))

usePassport(app)


app.use(bodyParser.urlencoded({ extende: true }))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)

require('./config/mongoose')

app.listen(port, () => {
  console.log(`The tracker is on the http://localhost:${port}`)
})
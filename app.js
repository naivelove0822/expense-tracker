const express = require('express')
const app = express()
const routes = require('./routes')
const port = 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
require('./config/mongoose')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use(bodyParser.urlencoded({ extende: true }))
app.use(methodOverride('_method'))

app.use(routes)


app.listen(port, () => {
  console.log(`The tracker is on the http://localhost:${port}`)
})
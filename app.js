const express = require('express')
const app = express()
const port = 3000
const Expense = require('./models/record')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tracker-list', { useNewUrlParser: true, useUnifiedTopology: true })

const exphbs = require('express-handlebars')

const db = mongoose.connection

db.on('error', () => {
  console.log('mogondb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extende: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  Expense.find()
    .lean()
    .then((expenses => {
      let totalAmount = 0
      expenses.map(expense => {
        totalAmount += Number(expense.amount)
      })
      return res.render('index', { expenses: expenses, totalAmount: totalAmount })
    }))
    .catch(err => console.log(err))
})

app.get('/expense/new', (req, res) => {
  return res.render('new')
})

app.post('/expense', (req, res) => {
  const { name, date, amount } = req.body
  return Expense.create({ name, date, amount })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})
//method未改
app.get('/expense/:id/edit', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .lean()
    .then((expense) => res.render('edit', { expense }))
    .catch(err => console.log(err))
})

app.put('/expense/:id', (req, res) => {
  const id = req.params.id
  const { name, date, amount } = req.body
  return Expense.findById(id)
    .then(expense => {
      expense.name = name
      expense.date = date
      expense.amount = amount
      return expense.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})



//method未改
app.delete('/expense/:id', (req, res) => {
  const id = req.params.id
  return Expense.findById(id)
    .then(expense => expense.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


app.listen(port, () => {
  console.log(`The tracker is on the http://localhost:${port}`)
})
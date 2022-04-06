const mongoose = require('mongoose')
const Expense = require('../record')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tracker-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

const SEED_EXPENSE = {
  name: "午餐",
  date: "2022-07-07",
  category: "餐飲食品",
  amount: "70"
}

db.on('error', () => {
  console.log('mogondb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  Expense.create(SEED_EXPENSE)
  console.log('done')
})

const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Expense = require('../record')
const User = require('../user')
const Category = require('../category')
const db = require('../../config/mongoose')

const SEED_USER = [{
  name: '廣志',
  email: 'user1@example.com',
  password: '12345678',
  expense: [
    {
      name: "午餐",
      date: "2019-04-23",
      category: "餐飲食品",
      amount: 60
    },
    {
      name: "晚餐",
      date: "2019-04-23",
      category: "餐飲食品",
      amount: 60
    },
    {
      name: "捷運",
      date: "2019-04-23",
      category: "交通出行",
      amount: 120
    },
    {
      name: "電影:驚奇隊長",
      date: "2019-04-23",
      category: "休閒娛樂",
      amount: 220
    },
    {
      name: "租金",
      date: "2015-04-01",
      category: "家居物業",
      amount: 25000
    }
  ]
},
{
  name: '小新',
  email: 'user2@example.com',
  password: '12345678',
  expense: [
    {
      name: "晚餐",
      date: "2019-04-23",
      category: "餐飲食品",
      amount: 60
    },
    {
      name: "捷運",
      date: "2019-04-23",
      category: "交通出行",
      amount: 120
    },
  ]
}]




db.on('error', () => {
  console.log('mogondb error!')
})

db.once('open', () => { 
  return Promise.all(Array.from(SEED_USER, seed_user => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seed_user.password, salt))
      .then(hash => {
    return User.create({
        name: seed_user.name,
        email: seed_user.email,
        password: hash
      })
    })
      .then(user => {
        return Promise.all(Array.from(seed_user.expense, expense => {
          return Category.findOne({ name: expense.category })
            .then(category => {
              expense.categoryId = category._id
              expense.userId = user._id
              return Expense.create(expense)
            })
        }))
      })
  }))
    .then(() => {
      console.log('done')
      process.exit()
    })
    .catch(err => console.log(err))
})

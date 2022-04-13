const Category = require('../category')
const categorys = require('./categorys.json')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

db.once('open', () => {
  return Promise.all(Array.from(categorys, item => {
    return Category.create({ name: item.name, icon: item.icon })
  }))
    .then(() => {
      console.log('categorySeeder end')
      process.exit()
    })
    .catch(err => console.log(err))
})

